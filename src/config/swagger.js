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
                        student_number: { type: 'string', example: '23-12345' },
                        name: { type: 'string', example: 'John Smith' },
                        age: { type: 'integer', minimum: 1, example: 20 },
                        course: { type: 'string', example: 'BS Computer Science' },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                StudentCreate: {
                    type: 'object',
                    required: ['studentNumber', 'name', 'email', 'age', 'course'],
                    properties: {
                        studentNumber: { type: 'string', pattern: '^\\d{2}-\\d{5}$', example: '23-12345' },
                        name: { type: 'string', minLength: 2, example: 'John Smith' },
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        age: { type: 'integer', minimum: 1, example: 20 },
                        course: { type: 'string', example: 'BS Computer Science' }
                    }
                },
                StudentUpdate: {
                    type: 'object',
                    required: ['name', 'age', 'course'],
                    properties: {
                        name: { type: 'string', minLength: 2, example: 'John Smith Updated' },
                        age: { type: 'integer', minimum: 1, example: 21 },
                        course: { type: 'string', example: 'BS Information Technology' }
                    }
                },
                StudentCreateResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Student account created successfully' },
                        user: { $ref: '#/components/schemas/User' },
                        student: { $ref: '#/components/schemas/Student' },
                        initialPassword: { type: 'string', example: 'John@2345' }
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