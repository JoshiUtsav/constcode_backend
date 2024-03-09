const Security = [
  {
    bearerAuth: [],
  },
];

const SignUp = {
  tags: ["User"],
  description: "Create new user account!",
  operationId: "Sign Up",
  requestBody: {
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            fullName: {
              type: "string",
              example: "John doe",
            },
            email: {
              type: "string",
              example: "example@gmail.com",
            },
            password: {
              type: "string",
              example: "Password@123",
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    "200": {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              successCode: {
                type: "String",
                example: "SUCCESS!",
              },
              successMessage: {
                type: "String",
                example: "Verify your email before login!",
              },
              data: {
                type: "Object",
                example: {
                  message:
                    "Check your inbox and click the provided link to verify you email address!",
                },
              },
            },
          },
        },
      },
    },
  },
};

export { SignUp };
