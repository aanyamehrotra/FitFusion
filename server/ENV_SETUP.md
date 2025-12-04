# Environment Variables Setup Guide

## Required Environment Variables

Create a `.env` file in the `server` directory with the following variables:

### MongoDB Connection (MONGO_URI)

For **local MongoDB Compass**:
```
MONGO_URI=mongodb://localhost:27017/fitfusion
```

For **MongoDB Atlas** (cloud):
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fitfusion
```

### JWT Secret (JWT_SECRET)

Generate a secure secret key:
```bash
openssl rand -base64 32
```

Or use a simple one for development:
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Server Port (Optional)

Default is 5000, but you can customize:
```
PORT=5000
```

## Example .env File

```env
MONGO_URI=mongodb://localhost:27017/fitfusion
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

## Troubleshooting

1. **Database Connection Failed**
   - Make sure MongoDB is running on your system
   - Check that the connection string matches your MongoDB setup
   - For MongoDB Compass, ensure the database name matches

2. **Registration/Login Fails**
   - Verify MONGO_URI is correct
   - Ensure JWT_SECRET is set
   - Check server console for detailed error messages

3. **Server Won't Start**
   - Check that all required environment variables are set
   - Verify the .env file is in the `server` directory
   - Ensure MongoDB is running before starting the server


