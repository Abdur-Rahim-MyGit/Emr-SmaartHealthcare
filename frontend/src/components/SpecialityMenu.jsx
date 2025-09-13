import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const SpecialityMenu = () => {
  const navigate = useNavigate()
  const { speciality } = useParams()
  
  const specialties = [
    { name: 'General physician', icon: '👨‍⚕️' },
    { name: 'Gynecologist', icon: '👩‍⚕️' },
    { name: 'Dermatologist', icon: '🔬' },
    { name: 'Pediatricians', icon: '👶' },
    { name: 'Neurologist', icon: '🧠' },
    { name: 'Gastroenterologist', icon: '🏥' }
  ]

  const handleSpecialtyClick = (specialty) => {
    console.log('Navigating to specialty:', specialty)
    navigate(`/doctors/${encodeURIComponent(specialty)}`)
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="grid grid-cols-1 gap-2">
        {specialties.map((specialty, index) => (
          <button
            key={index}
            onClick={() => handleSpecialtyClick(specialty.name)}
            className={`flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors ${
              speciality === specialty.name ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <span className="text-2xl mr-3">{specialty.icon}</span>
            <span className="text-sm font-medium">{specialty.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SpecialityMenu