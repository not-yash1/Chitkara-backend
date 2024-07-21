
const captureIpAddress = (req, res, next) => {
    // Get the IP address from the request headers or connection information
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
    // If the IP address is in IPv6 format, convert it to IPv4 if necessary
    if (ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }
  
    if (ip.startsWith('::ffff:')) {
      ip = ip.replace('::ffff:', '');
    }
  
    // Attach the IP address to the request object
    req.userIp = ip;
  
    // Proceed to the next middleware or route handler
    next();
  };
  
  export default captureIpAddress;
  