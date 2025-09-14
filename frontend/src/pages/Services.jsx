import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaBrain, FaDumbbell, FaEye, FaBalanceScale, FaCalendarCheck, FaArrowRight } from 'react-icons/fa';
import BookingModal from '../components/BookingModal';

const services = [
  {
    id: 1,
    title: "SMAART Metabolism",
    description: "Comprehensive metabolic health management with AI-powered diagnostics and personalized treatment plans.",
    image: "https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: <FaHeartbeat />,
    features: ["Type 2 Diabetes & Prediabetes", "Obesity & Weight Management", "Thyroid Disorders", "PCOS/PCOD", "Lipid Disorders", "Fatty Liver Disease", "Gout Management"]
  },
  {
    id: 2,
    title: "SMAART Minds",
    description: "Mental health & cognitive care combining traditional therapy with advanced assessment tools.",
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: <FaBrain />,
    features: ["Anxiety & Panic Disorders", "Depression Treatment", "Sleep Disorders", "ADHD & Learning Disabilities", "PTSD & OCD", "Memory Problems", "Cognitive Enhancement"]
  },
  {
    id: 3,
    title: "SMAART Physio",
    description: "Musculoskeletal & rehabilitation services with evidence-based treatment protocols.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: <FaDumbbell />,
    features: ["Musculoskeletal Pain", "Joint Disorders", "Pre & Post-Surgery Rehab", "Sports Injuries", "Neurological Rehabilitation", "Chronic Pain Management", "Pelvic Floor Therapy", "Geriatric Physiotherapy"]
  },
  {
    id: 4,
    title: "SMAART Eyes",
    description: "Comprehensive eye care with advanced diagnostic technology and specialized treatments.",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: <FaEye />,
    features: ["Diabetic Retinopathy", "Glaucoma Management", "Cataract Treatment", "Age-Related Macular Degeneration"]
  },
  {
    id: 5,
    title: "SMAART Balance",
    description: "Specialized vertigo & balance disorder treatment with vestibular rehabilitation programs.",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: <FaBalanceScale />,
    features: ["Vertigo (BPPV, Vestibular Migraine)", "Labyrinthitis & Vestibular Neuritis", "Postural Instability", "Motion Sickness", "Fall Risk Assessment"]
  }
];
export default function Services({ openAppointmentModal }) {
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleReadMore = idx => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary to-teal-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-3">
            <FaHeartbeat className="text-primary" />
            Our Services
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive healthcare solutions delivered by our expert medical professionals
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-gradient-to-br from-white via-white to-blue-50/20 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-white/50 backdrop-blur-sm"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-2 text-white">
                      {React.cloneElement(service.icon, { className: "w-5 h-5" })}
                      <span className="font-medium">{service.title}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-3">
                    {service.description}
                  </p>
                  
                  {expandedIdx === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        {service.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <button
                    onClick={() => handleReadMore(idx)}
                    className="px-4 py-2 text-primary border border-primary/20 rounded-lg font-medium hover:bg-gradient-to-r hover:from-primary/10 hover:to-blue-50 transition-all"
                  >
                    {expandedIdx === idx ? 'Show Less' : 'Learn More'}
                  </button>
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-medium hover:from-primary/90 hover:to-blue-500 transition-all shadow-sm hover:shadow-md"
                    onClick={() => setShowBookingModal(true)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Booking Modal */}
      <BookingModal 
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </div>
  );
}
