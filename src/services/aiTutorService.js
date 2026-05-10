import Anthropic from '@anthropic-ai/sdk';

class AITutorService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }

  // Generate explanation for a question
  async explainQuestion(question, options, correctAnswer, explanation) {
    try {
      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `You are an expert nursing tutor. A student is asking for help understanding this nursing exam question:

Question: ${question}

Options:
A) ${options.A}
B) ${options.B}
C) ${options.C}
D) ${options.D}

Correct Answer: ${correctAnswer}

Official Explanation: ${explanation}

Please provide:
1. A clear, simple explanation of why this is the correct answer
2. Why the other options are incorrect
3. Key concepts a nursing student should understand
4. Any clinical relevance or real-world application

Keep your response friendly and encouraging.`,
          },
        ],
      });

      return message.content[0].type === 'text' ? message.content[0].text : '';
    } catch (error) {
      throw new Error(`AI explanation failed: ${error.message}`);
    }
  }

  // Generate quiz for a topic
  async generateTopicQuiz(topic, subject, numberOfQuestions = 5) {
    try {
      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: `Generate ${numberOfQuestions} nursing exam-style questions for the topic: "${topic}" in the subject: "${subject}".

Format your response as a JSON array with the following structure:
[
  {
    "question": "Question text here?",
    "options": {
      "A": "Option A",
      "B": "Option B",
      "C": "Option C",
      "D": "Option D"
    },
    "correctAnswer": "A",
    "explanation": "Why this is correct and why others are wrong"
  }
]

Make questions realistic, challenging, and aligned with JAMB nursing entrance exam standards.`,
          },
        ],
      });

      const responseText = message.content[0].type === 'text' ? message.content[0].text : '[]';
      
      try {
        // Extract JSON from response (might have extra text)
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        return [];
      } catch (parseError) {
        console.error('Error parsing generated quiz:', parseError);
        return [];
      }
    } catch (error) {
      throw new Error(`Quiz generation failed: ${error.message}`);
    }
  }

  // Chat-based tutoring
  async chatWithTutor(conversationHistory) {
    try {
      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: `You are a compassionate and knowledgeable nursing tutor helping students prepare for their nursing school entrance exams (JAMB Post-UTME). 

Your role is to:
- Explain nursing concepts clearly and simply
- Help students understand exam questions
- Provide clinical context and real-world applications
- Encourage and motivate struggling students
- Check understanding and provide practice questions
- Be patient and non-judgmental

Always respond in a friendly, encouraging tone. If a question is outside nursing, gently redirect the conversation back to nursing studies.`,
        messages: conversationHistory.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      return message.content[0].type === 'text' ? message.content[0].text : '';
    } catch (error) {
      throw new Error(`Chat failed: ${error.message}`);
    }
  }

  // Generate study notes for a topic
  async generateStudyNotes(topic, subject) {
    try {
      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: `Create concise study notes for nursing students on the topic: "${topic}" (Subject: ${subject}).

Format with:
1. Key Definitions (2-3 sentences each)
2. Main Concepts (numbered list)
3. Important Points to Remember (bullet points)
4. Clinical Relevance (how this applies in practice)
5. Common Exam Questions (list 3-5 common question types)

Keep it concise - this is for quick revision before exams.`,
          },
        ],
      });

      return message.content[0].type === 'text' ? message.content[0].text : '';
    } catch (error) {
      throw new Error(`Study notes generation failed: ${error.message}`);
    }
  }

  // Analyze weak areas based on exam performance
  async analyzeWeakAreas(performanceData) {
    try {
      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Based on this nursing exam performance data, identify the student's weak areas and provide study recommendations:

${JSON.stringify(performanceData, null, 2)}

Please provide:
1. Identified weak areas (topics/subjects with lowest scores)
2. Why these topics are challenging (potential knowledge gaps)
3. Specific study recommendations
4. Suggested study materials or approaches
5. Estimated time needed to improve`,
          },
        ],
      });

      return message.content[0].type === 'text' ? message.content[0].text : '';
    } catch (error) {
      throw new Error(`Weak area analysis failed: ${error.message}`);
    }
  }

  // Generate flashcards for a topic
  async generateFlashcards(topic, subject, numberOfCards = 10) {
    try {
      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: `Generate ${numberOfCards} flashcards for nursing students studying "${topic}" in ${subject}.

Format as JSON array:
[
  {
    "front": "Question or term",
    "back": "Answer or definition (concise, 1-2 sentences)"
  }
]

Make them:
- Focused on key concepts
- Aligned with JAMB standards
- Progressive in difficulty`,
          },
        ],
      });

      const responseText = message.content[0].type === 'text' ? message.content[0].text : '[]';
      
      try {
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        return [];
      } catch (parseError) {
        console.error('Error parsing flashcards:', parseError);
        return [];
      }
    } catch (error) {
      throw new Error(`Flashcard generation failed: ${error.message}`);
    }
  }
}

export default new AITutorService();
