import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import LenisScroll from "./components/LenisScroll";
import Generate from "./pages/Generate";
import MyGeneration from "./pages/MyGeneration";
import Login from "./components/Login";
import Contact from "./pages/Contact";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";

export default function App() {
    const { pathname } = useLocation();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <>
            <LenisScroll />
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/contact" element={<Contact />} />

                <Route path="/generate" element={
                    <ProtectedRoute><Generate /></ProtectedRoute>
                } />
                <Route path="/generate/:id" element={
                    <ProtectedRoute><Generate /></ProtectedRoute>
                } />
                <Route path="/my-generation" element={
                    <ProtectedRoute><MyGeneration /></ProtectedRoute>
                } />
            </Routes>
            <Footer />
        </>
    );
}