// src/pages/Home.jsx
import React from 'react';
import HeroSection from '../components/home/HeroSection';
import AboutUsSection from '../components/home/AboutUsSection';
import ClassesSection from '../components/home/ClassesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';


export default function Home() {
    return (
        <>
            {/* Hero Section */}
            <HeroSection />

            {/* Quienes Somos Section */}
            <AboutUsSection />

            {/* Que Ofrecemos Section */}
            <ClassesSection/>

            {/* Testimonials Section */}
            <TestimonialsSection/>

        </>
    )
}
