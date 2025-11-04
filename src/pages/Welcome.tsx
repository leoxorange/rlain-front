import clsx from "clsx"
import CTA from "../components/CTA"
import Devices from "../components/Devices"
import Footer from "../components/Footer"
import Hero from "../components/Hero"
import Integrations from "../components/Integrations"
import Navbar from "../components/Navbar"
import Features from "../components/Features"
import { CreateRootUserModal } from "../components/CreateUserModal"
import { LoginModal } from "../components/LoginModal"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Welcome = () => {

  const navigate = useNavigate()
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const handleFreeTrial = () => {
    setIsRegisterModalOpen(true)
  }

  const handleLogin = () => {
    setIsLoginModalOpen(true)
  }

  const handleRegisterModalClose = () => {
    setIsRegisterModalOpen(false)
  }

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false)
  }

  const handleUserCreated = () => {
    setIsRegisterModalOpen(false)
    navigate('/library')
  }

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false)
    navigate('/library')
  }

  return (
    <div className={clsx(
      "min-h-screen w-full bg-gradient-to-b from-[var(--bg)] to-[var(--bg-alt)] text-body",
      "transition-all duration-300"
    )}>
      <Navbar handleFreeTrial={handleFreeTrial} handleLogin={handleLogin} />
      <main className="w-full">
        <Hero />
        <Integrations />
        <Features />
        <Devices />
        <CTA />
      </main>
      <Footer />

      {/* Register Modal */}
      <CreateRootUserModal
        isOpen={isRegisterModalOpen}
        onClose={handleRegisterModalClose}
        onSuccess={handleUserCreated}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        onSuccess={handleLoginSuccess}
      />
    </div>
  )
}

export { Welcome }