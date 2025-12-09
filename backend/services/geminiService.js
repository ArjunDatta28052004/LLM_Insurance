const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  /**
   * Analyze insurance claim against policy
   */
  async analyzeClaim(policyText, queryContent) {
    const prompt = this.buildPrompt(policyText, queryContent);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseResponse(text);
    } catch (error) {
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  /**
   * Build prompt for Gemini
   */
  buildPrompt(policyText, queryContent) {
    return `
You are an expert insurance claim validator with deep knowledge of insurance policies and claim processing.

INSURANCE POLICY DOCUMENT:
${policyText}

CLAIM DETAILS:
${queryContent}

TASK:
Analyze this claim carefully against the insurance policy and provide a comprehensive assessment.

INSTRUCTIONS:
1. Check if the claim meets all policy requirements
2. Verify coverage eligibility based on the provided information
3. Check for any exclusions or limitations
4. Consider waiting periods, pre-existing conditions, and other standard clauses
5. Provide specific policy references

OUTPUT FORMAT (Must be valid JSON):
{
  "isValid": true or false,
  "reasoning": "Provide detailed step-by-step reasoning explaining why the claim is valid or invalid. Reference specific policy clauses and conditions.",
  "coverage": "Describe what is covered, coverage limits, any co-payments, deductibles, or other important details. If claim is invalid, explain what would be needed for approval."
}

Respond ONLY with the JSON object, no additional text or markdown formatting.
`;
  }

  /**
   * Parse Gemini response
   */
  parseResponse(text) {
    try {
      // Remove markdown code blocks if present
      let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Try to parse as JSON
      const jsonResponse = JSON.parse(cleanText);
      
      // Validate required fields
      if (typeof jsonResponse.isValid !== 'boolean') {
        throw new Error('Invalid response format: isValid must be boolean');
      }
      
      return {
        isValid: jsonResponse.isValid,
        reasoning: jsonResponse.reasoning || 'No reasoning provided',
        coverage: jsonResponse.coverage || 'Coverage details not available'
      };
    } catch (parseError) {
      // Fallback: analyze text for validity keywords
      const isValid = text.toLowerCase().includes('valid') && 
                     !text.toLowerCase().includes('invalid') &&
                     !text.toLowerCase().includes('not valid');
      
      return {
        isValid: isValid,
        reasoning: text,
        coverage: 'Please refer to the detailed analysis above for coverage information.'
      };
    }
  }
}

module.exports = new GeminiService();