/**
 * Authentication Middleware
 * 
 * Provides JWT authentication middleware for protecting routes.
 * Verifies tokens using Supabase JWT verification.
 */

const supabase = require('../utils/supabaseClient');

/**
 * Authenticate JWT middleware
 * Verifies the JWT token from the Authorization header
 * Sets the authenticated user on the request object
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticateJWT = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. Missing or invalid token.' });
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Verify the token with Supabase
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
    
    // Set the authenticated user on the request object
    req.user = data.user;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication failed due to server error.' });
  }
};

/**
 * Check if user is a retailer staff member
 * Verifies that the authenticated user has access to the specified retailer
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const isRetailerStaff = async (req, res, next) => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    
    const retailerId = req.body.retailerId || req.params.retailerId || req.query.retailerId;
    
    if (!retailerId) {
      return res.status(400).json({ message: 'Retailer ID is required.' });
    }
    
    // Check if user is associated with the retailer
    const { data, error } = await supabase
      .from('retailer_users')
      .select('*')
      .eq('profile_id', req.user.id)
      .eq('retailer_id', retailerId)
      .single();
    
    if (error || !data) {
      return res.status(403).json({ message: 'Access denied. You are not authorized for this retailer.' });
    }
    
    // Set the retailer role on the request object
    req.retailerRole = data.role;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Retailer staff check error:', error);
    res.status(500).json({ message: 'Authorization check failed due to server error.' });
  }
};

/**
 * Check if user is a retailer admin
 * Verifies that the authenticated user has admin role for the specified retailer
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const isRetailerAdmin = async (req, res, next) => {
  try {
    // First check if user is a retailer staff member
    await isRetailerStaff(req, res, () => {
      // Then check if the role is admin
      if (req.retailerRole !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin role required.' });
      }
      
      // Continue to the next middleware or route handler
      next();
    });
  } catch (error) {
    console.error('Retailer admin check error:', error);
    res.status(500).json({ message: 'Authorization check failed due to server error.' });
  }
};

module.exports = {
  authenticateJWT,
  isRetailerStaff,
  isRetailerAdmin
};
