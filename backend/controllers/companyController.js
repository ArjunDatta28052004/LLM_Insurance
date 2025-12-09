const Company = require('../models/Company');
const FileService = require('../services/fileService');

class CompanyController {
  /**
   * Get all companies
   */
  static async getAllCompanies(req, res, next) {
    try {
      const companies = await Company.find({}, 'name uploadedAt metadata')
        .sort({ uploadedAt: -1 });
      
      res.json(companies);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single company
   */
  static async getCompany(req, res, next) {
    try {
      const company = await Company.findById(req.params.id);
      
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }
      
      res.json(company);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload policy
   */
  static async uploadPolicy(req, res, next) {
    try {
      const { companyName } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      if (!companyName) {
        await FileService.deleteFile(req.file.path);
        return res.status(400).json({ error: 'Company name is required' });
      }

      // Extract text from file
      const policyText = await FileService.extractText(req.file.path);
      
      // Get file metadata
      const metadata = await FileService.getFileMetadata(req.file.path);

      // Save to database
      const company = await Company.findOneAndUpdate(
        { name: companyName },
        { 
          name: companyName,
          policyText: policyText,
          uploadedAt: new Date(),
          metadata: metadata
        },
        { upsert: true, new: true }
      );

      // Clean up uploaded file
      await FileService.deleteFile(req.file.path);

      res.json({ 
        success: true, 
        message: 'Policy uploaded successfully',
        companyId: company._id,
        companyName: company.name
      });
    } catch (error) {
      if (req.file) {
        await FileService.deleteFile(req.file.path);
      }
      next(error);
    }
  }

  /**
   * Delete company
   */
  static async deleteCompany(req, res, next) {
    try {
      const company = await Company.findByIdAndDelete(req.params.id);
      
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }
      
      res.json({ 
        success: true, 
        message: 'Company deleted successfully' 
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CompanyController;