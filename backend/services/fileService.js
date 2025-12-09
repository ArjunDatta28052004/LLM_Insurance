const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-parse');

class FileService {
  /**
   * Extract text from uploaded file
   */
  static async extractText(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    try {
      if (ext === '.pdf') {
        return await this.extractFromPDF(filePath);
      } else if (ext === '.txt') {
        return await this.extractFromTXT(filePath);
      } else if (ext === '.doc' || ext === '.docx') {
        // For production, use mammoth.js for proper DOCX parsing
        return await this.extractFromTXT(filePath);
      } else {
        throw new Error('Unsupported file format');
      }
    } catch (error) {
      throw new Error(`Failed to extract text: ${error.message}`);
    }
  }

  /**
   * Extract text from PDF
   */
  static async extractFromPDF(filePath) {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  /**
   * Extract text from TXT file
   */
  static async extractFromTXT(filePath) {
    return await fs.readFile(filePath, 'utf8');
  }

  /**
   * Delete file after processing
   */
  static async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  /**
   * Get file metadata
   */
  static async getFileMetadata(filePath) {
    const stats = await fs.stat(filePath);
    return {
      fileSize: stats.size,
      fileType: path.extname(filePath),
      originalName: path.basename(filePath)
    };
  }
}

module.exports = FileService;