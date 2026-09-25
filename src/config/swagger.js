import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',

        info: {
            title: 'Group 3 Student Management API',
            version: '1.0.0',
            description: 'API documentation for the Group 3 Student Management System'
        },

        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local development server'
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },

            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Jane Doe' },
                        email: { type: 'string', format: 'email', example: 'jane@example.com' },
                        role: { type: 'string', enum: ['student', 'admin'], example: 'student' },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                Student: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        user_id: { type: 'integer', nullable: true, example: null },
                        name: { type: 'string', example: 'John Smith' },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        error: {
                            type: 'object',
                            properties: {
                                code: { type: 'string', example: 'ROUTE_NOT_FOUND' },
                                message: { type: 'string', example: 'Route not found' },
                                details: { nullable: true, example: null },
                                timestamp: { type: 'string', format: 'date-time' },
                                path: { type: 'string', example: '/api/students' }
                            }
                        }
                    }
                }
            }
        }
    },

    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;