import Tags from "./Tags";
import Paths from "./Paths/index";

const ApiDocs = {
  openapi: "3.0.1",
  info: {
    version: "1.0.0",
    title: "Api Backend Documentation",
    description:
      "NOTE: You can switch between local and production sever by left side Severs dropdowns options.",
    termsOfService: "https://github.com/joshiUtsav",
    contact: {
      name: "Utsav joshi",
      email: "Utsavjoshi602@gmail.com",
      url: "https://www.linkedin.com/in/joshi-utsav/",
    },
  },
  servers: [
    {
      url: "https://apnacollege-backend-1.onrender.com/", // replace it with deployed server url
      description: "Production Server",
    },
    {
      url: "http://localhost:3000/",
      description: "Local Server",
    },
  ],
  tags: Tags,
  paths: Paths,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

export default ApiDocs;
