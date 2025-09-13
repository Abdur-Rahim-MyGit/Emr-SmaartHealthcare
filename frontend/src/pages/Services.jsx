import React, { useState } from 'react';
import { FaHeartbeat, FaBrain, FaDumbbell, FaEye, FaBalanceScale } from 'react-icons/fa';

const services = [
  {
    title: 'SMAART Metabolism',
    icon: <FaHeartbeat className="text-primary text-4xl mb-2" />,
    description: [
      'Comprehensive precision care for managing and remission of metabolic disorders',
      'Type 2 Diabetes and Prediabetes (Insulin Resistance)',
      'Obesity and Weight Management',
      'Thyroid Disorders (Hypothyroidism, Hyperthyroidism)',
      'PCOS/PCOD (Polycystic Ovary Syndrome)',
      'Lipid Disorders (High Cholesterol, Dyslipidemia)',
      'Fatty Liver Disease (NAFLD)',
      'Gout (Elevated Uric Acid Levels)'
    ]
  },
  {
    title: 'SMAART Minds',
    icon: <FaBrain className="text-primary text-4xl mb-2" />,
    description: [
      'Focused on mental health and cognitive well-being',
      'Anxiety Disorders (Generalized Anxiety, Panic Attacks, Social Anxiety)',
      'Stress Management',
      'Depression (Major Depressive Disorder, Dysthymia)',
      'Sleep Disorders (Insomnia, Sleep Apnea Counseling)',
      'Learning Disabilities (Dyslexia, ADHD)',
      'PTSD, OCD',
      'Chronic Fatigue Syndrome',
      'Memory Problems (Early Dementia Screening, Mild Cognitive Impairment)',
      'Cognitive Ageing, Focus, Attention, Performance assessment and enhancement'
    ]
  },
  {
    title: 'SMAART Physio',
    icon: <FaDumbbell className="text-primary text-4xl mb-2" />,
    description: [
      'Advanced physiotherapy and rehabilitation care',
      'Musculoskeletal Pain (Back Pain, Neck Pain, Shoulder Pain)',
      'Joint Disorders (Arthritis, Frozen Shoulder, Bursitis)',
      'Pre & Post-Surgery Rehabilitation (Knee Replacement, Spine Surgery, Sports Injuries)',
      'Sports Injuries (Ligament Tears, Sprains, Strains)',
      'Neurological Rehabilitation (Stroke, Paralysis, Multiple Sclerosis)',
      'Chronic Pain Syndromes (Fibromyalgia, Myofascial Pain)',
      'Postural Imbalance and Ergonomics Correction',
      'Pelvic Floor Therapy (Incontinence, Postpartum Rehabilitation)',
      'Geriatric Physiotherapy'
    ]
  },
  {
    title: 'SMAART Eyes',
    icon: <FaEye className="text-primary text-4xl mb-2" />,
    description: [
      'Expert care for eye diseases',
      'Diabetic Retinopathy',
      'Glaucoma',
      'Cataracts',
      'Age-Related Macular Degeneration (AMD)'
    ]
  },
  {
    title: 'SMAART Balance',
    icon: <FaBalanceScale className="text-primary text-4xl mb-2" />,
    description: [
      'Specialized diagnosis, treatment and rehabilitation for conditions affecting balance',
      'Vertigo (BPPV, Vestibular Migraine, Meniere’s Disease)',
      'Labyrinthitis and Vestibular Neuritis',
      'Postural Instability',
      'Cervicogenic Dizziness',
      'Motion Sickness',
      'Post-Concussion Syndrome (Balance-related issues)',
      'Elderly Fall Risk Assessment and Management'
    ]
  }
];
// bg-gradient-to-br from-blue-100 via-teal-100 to-white
export default function Services({ openAppointmentModal }) {
  const [expandedIdx, setExpandedIdx] = useState(null);

  const handleReadMore = idx => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-teal-100 to-white py-16 px-4 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6 text-center font-sans">Our Services</h1>
        <p className="text-base text-gray-600 mb-8 max-w-xl mx-auto text-center font-sans">
          Advanced healthcare delivered by specialists. Explore our patient-centric services.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div key={idx} className="relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-7 flex flex-col items-center border border-gray-100">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shadow-sm">
                {React.cloneElement(service.icon, { className: "text-primary text-2xl" })}
              </div>
              <div className="pt-8 pb-2 w-full flex flex-col items-center">
                <h2 className="text-lg font-bold text-gray-900 mb-2 text-center font-sans w-full">{service.title}</h2>
                <div className="text-gray-600 mb-3 text-sm leading-relaxed font-sans w-full flex flex-col items-center">
                  <div className="mb-2 font-semibold text-gray-700 text-sm text-center w-full">{service.description[0]}</div>
                  {expandedIdx === idx ? (
                    <ul className="list-disc list-inside mt-4 text-gray-700 text-left w-full text-[15px] font-normal">
                      {service.description.slice(1).map((item, i) => (
                        <li key={i} className="mb-2 pl-1">{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div className="flex gap-3 mt-6 w-full justify-center">
                  <button
                    className={`px-5 py-2 rounded-md text-white text-sm font-semibold shadow-md transition-colors duration-200 ${expandedIdx === idx ? 'bg-primary/80' : 'bg-primary'} hover:bg-primary/90`}
                    onClick={() => handleReadMore(idx)}
                  >
                    {expandedIdx === idx ? 'Show Less' : 'Read More'}
                  </button>
                  <button
                    className="px-5 py-2 rounded-md bg-teal-500 text-white text-sm font-semibold shadow-md hover:bg-teal-600 transition-colors duration-200"
                    onClick={openAppointmentModal}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
