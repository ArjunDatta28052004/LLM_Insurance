const Company = require('../models/company');
const FileService = require('../services/fileService');
const geminiService = require('../services/geminiService');

class ClaimController {
  /**
   * Query claim
   */
  static async queryClaim(req, res, next) {
    try {
      const { companyId, queryText } = req.body;

      if (!companyId) {
        return res.status(400).json({ error: 'Company ID is required' });
      }

      // Get company policy
      const company = await Company.findById(companyId);
      if (!company) {
        if (req.file) {
          await FileService.deleteFile(req.file.path);
        }
        return res.status(404).json({ error: 'Company not found' });
      }

      // Prepare query content
      let queryContent = queryText || '';
      
      if (req.file) {
        const documentText = await FileService.extractText(req.file.path);
        queryContent += '\n\nUploaded Document Content:\n' + documentText;
        await FileService.deleteFile(req.file.path);
      }

      if (!queryContent.trim()) {
        return res.status(400).json({ 
          error: 'Query text or document is required' 
        });
      }

      // Analyze with Gemini
      const result = await geminiService.analyzeClaim(
        company.policyText, 
        queryContent
      );

      res.json(result);
    } catch (error) {
      if (req.file) {
        await FileService.deleteFile(req.file.path);
      }
      next(error);
    }
  }
}

module.exports = ClaimController;
