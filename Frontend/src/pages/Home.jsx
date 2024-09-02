import React from "react";
import { Box } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import Navbar from "../components/Navbar";
import AllRoutes from "../routes/AllRoutes";
import { Footer } from "../components/Footer"; // Ensure Footer is imported correctly

const Home = ({user}) => {


  return (
    <Box bg="white" color="black" minHeight="100vh">
      {/* Navbar with user prop */}
      <Navbar user={user} />

      {/* Main Content */}
      <AllRoutes />

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Home;
