const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const { auth } = require('./auth');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here'
});
const openai = new OpenAIApi(configuration);

// AI usage tracking
const aiUsage = {
  daily: {}, 
  monthly: {},
  total: 0
};

// Rate limiter: 50 AI requests per user per hour
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => req.user._id.toString(),
  message: { 
    error: 'AI usage limit reached. Please try again in an hour.' 
  }
});

// Track AI usage
async function trackAIUsage(userId, tokens) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const month = today.substring(0, 7);
    
    if (!aiUsage.daily[today]) aiUsage.daily[today] = {};
    if (!aiUsage.monthly[month]) aiUsage.monthly[month] = {};
    if (!aiUsage.daily[today][userId]) aiUsage.daily[today][userId] = 0;
    if (!aiUsage.monthly[month][userId]) aiUsage.monthly[month][userId] = 0;
    
    aiUsage.daily[today][userId] += tokens;
    aiUsage.monthly[month][userId] += tokens;
    aiUsage.total += tokens;
    
    console.log(`AI usage tracked: User ${userId}, Tokens: ${tokens}`);
  } catch (error) {
    console.error('Error tracking AI usage:', error);
  }
}

// Validate question content
function validateQuestion(question) {
  const blockedWords = ['inappropriate', 'spam', 'blocked'];
  const lowerQuestion = question.toLowerCase();
  
  for (const word of blockedWords) {
    if (lowerQuestion.includes(word)) {
      throw new Error('Question contains inappropriate content');
    }
  }
  
  if (question.length > 2000) {
    throw new Error('Question exceeds maximum length of 2000 characters');
  }
  
  return true;
}

// POST /api/ai/ask - Ask AI a study question
router.post('/ask', auth, aiLimiter, async (req, res) => {
  try {
    const { question, subject, context = '' } = req.body;
    
    if (!question || !subject) {
      return res.status(400).json({ 
        success: false, 
        error: 'Question and subject are required' 
      });
    }
    
    validateQuestion(question);
    
    // Build prompt
    const prompt = buildStudyPrompt(question, subject, context);
    
    // Rate limit per user (on top of express-rate-limit)
    const userId = req.user._id.toString();
    const dailyUsage = await getAIDailyUsage(userId);
    if (dailyUsage > 10000) { // 10k tokens per day
      return res.status(429).json({ 
        success: false, 
        error: 'Daily AI usage limit reached' 
      });
    }
    
    // Call OpenAI API
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: getSystemPrompt(subject) },
        { role: 'user', content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.7,
      n: 1
    });
    
    const answer = completion.data.choices[0].message.content;
    const tokensUsed = completion.data.usage.total_tokens;
    
    // Track usage
    await trackAIUsage(userId, tokensUsed);
    
    // Save to user's history (optional)
    await saveAIQuestion(userId, subject, question, answer, tokensUsed);
    
    res.json({
      success: true,
      answer,
      subject,
      tokensUsed,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('AI Answer error:', error);
    
    if (error.response?.data?.error?.code === 'rate_limit_exceeded') {
      res.status(429).json({ 
        success: false, 
        error: 'AI service rate limit exceeded. Please try again later.' 
      });
    } else if (error.response?.status === 401) {
      res.status(500).json({ 
        success: false, 
        error: 'AI API key invalid. Please contact support.' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get AI answer. Please try again.' 
      });
    }
  }
});

// POST /api/ai/study-plan - Generate personalized study plan
router.post('/study-plan', auth, aiLimiter, async (req, res) => {
  try {
    const { subjects, dailyHours, examDate } = req.body;
    
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Subjects array is required with at least one subject' 
      });
    }
    
    if (!dailyHours || dailyHours < 1 || dailyHours > 12) {
      return res.status(400).json({ 
        success: false, 
        error: 'Daily study hours must be between 1-12' 
      });
    }
    
    const prompt = buildStudyPlanPrompt(subjects, dailyHours, examDate);
    
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert Ethiopian high school exam preparation coach.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1200,
      temperature: 0.5,
      n: 1
    });
    
    const plan = JSON.parse(completion.data.choices[0].message.content);
    const tokensUsed = completion.data.usage.total_tokens;
    
    res.json({
      success: true,
      studyPlan: plan,
      tokensUsed,
      generatedAt: new Date().toISOString(),
      subjects: subjects.length,
      dailyHours
    });
    
  } catch (error) {
    console.error('Study Plan error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate study plan' 
    });
  }
});

// POST /api/ai/review - Review essay or written content
router.post('/review', auth, aiLimiter, async (req, res) => {
  try {
    const { content, type = 'essay' } = req.body;
    
    if (!content || content.trim().length < 50) {
      return res.status(400).json({ 
        success: false, 
        error: 'Content must be at least 50 characters' 
      });
    }
    
    if (content.length > 5000) {
      return res.status(400).json({ 
        success: false, 
        error: 'Content exceeds maximum length of 5000 characters' 
      });
    }
    
    const prompt = buildReviewPrompt(content, type);
    
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert essay reviewer for Ethiopian ESLCE exam preparation.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.3,
      n: 1
    });
    
    const review = JSON.parse(completion.data.choices[0].message.content);
    const tokensUsed = completion.data.usage.total_tokens;
    
    res.json({
      success: true,
      review,
      tokensUsed,
      reviewedAt: new Date().toISOString(),
      type
    });
    
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to review content' 
    });
  }
});

// GET /api/ai/usage - Get user AI usage stats
router.get('/usage', auth, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const today = new Date().toISOString().split('T')[0];
    const month = today.substring(0, 7);
    
    const dailyUsage = aiUsage.daily[today]?.[userId] || 0;
    const monthlyUsage = aiUsage.monthly[month]?.[userId] || 0;
    
    res.json({
      success: true,
      usage: {
        daily: dailyUsage,
        monthly: monthlyUsage,
        limits: {
          daily: 10000,
          monthly: 100000
        }
      }
    });
  } catch (error) {
    console.error('Usage fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch usage' });
  }
});

// Helper functions
function getSystemPrompt(subject) {
  const prompts = {
    mathematics: "You are a mathematics tutor for Ethiopian high school students. Use clear, step-by-step explanations. Include relevant formulas and practice examples.",
    physics: "You are a physics tutor. Focus on concepts, formulas, and real-world applications. Use Ethiopian contexts where relevant.",
    chemistry: "You are a chemistry tutor. Explain chemical concepts, reactions, and equations clearly. Emphasize safety and practical applications.",
    biology: "You are a biology tutor. Use Ethiopian ecological examples and references where appropriate. Focus on understanding living systems.",
    civics: "You are a civics tutor for Ethiopian students. Reference the Ethiopian Constitution (Articles 25-45), governance, and democratic principles.",
    history: "You are a history tutor specializing in Ethiopian and world history. Provide specific dates, events, and historical context.",
    geography: "You are a geography tutor. Use Ethiopian geographical features, regions, and climate zones as examples.",
    english: "You are an English language tutor for ESLCE preparation. Focus on grammar, composition, and reading comprehension."
  };
  
  return prompts[subject.toLowerCase()] || "You are a helpful study assistant for Ethiopian high school students preparing for their national exams.";
}

function buildStudyPrompt(question, subject, context) {
  return `SUBJECT: ${subject}
STUDENT QUESTION: ${question}${context ? `
ADDITIONAL CONTEXT: ${context}` : ''}

Provide a detailed, step-by-step answer suitable for an Ethiopian Grade 10-12 student. Format:
1. Concept explanation
2. Step-by-step solution (if applicable)
3. Key points to remember
4. Practice example (if relevant)`;
}

function buildStudyPlanPrompt(subjects, dailyHours, examDate) {
  const daysUntilExam = Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24));
  
  return `CREATE STUDY PLAN:
Subjects: ${subjects.join(', ')}
Daily Hours: ${dailyHours}
Days Until Exam: ${daysUntilExam} (${examDate})

Return valid JSON with:
{
  "subjects": [{"subject": "name", "totalHours": number, "topics": ["topic1"], "priority": "high|medium|low", "studySchedule": ["Day 1: topic"]}],
  "dailySchedule": {"morning": ["subject"], "afternoon": ["subject"], "evening": ["subject"]},
  "revisionDays": number,
  "breakDays": number,
  "recommendation": "specific advice"
}`;
}

function buildReviewPrompt(content, type) {
  return `REVIEW THIS ${type.toUpperCase()}:

${content.substring(0, 3500)}${content.length > 3500 ? '...' : ''}

Return valid JSON with:
{
  "overallScore": number (0-100),
  "grammarScore": number (0-100),
  "structureScore": number (0-100),
  "clarityScore": number (0-100),
  "strengths": ["strength 1", "strength 2"],
  "suggestions": ["specific improvement 1", "specific improvement 2"],
  "estimatedGrade": "A|B|C|D",
  "nextSteps": ["what to do next"],
  "wordCount": number
}`;
}

async function getAIDailyUsage(userId) {
  const today = new Date().toISOString().split('T')[0];
  return aiUsage.daily[today]?.[userId] || 0;
}

async function saveAIQuestion(userId, subject, question, answer, tokens) {
  // In production, save to MongoDB
  try {
    console.log(`Saved AI interaction: User ${userId}, Subject: ${subject}, Tokens: ${tokens}`);
  } catch (error) {
    console.error('Failed to save AI question:', error);
  }
}

module.exports = router;" small "_\n\n", "type": "file"}`