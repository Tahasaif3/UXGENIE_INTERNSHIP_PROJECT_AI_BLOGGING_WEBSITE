"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { Menu, X, Sparkles, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import AuthModal from "@/components/auth-model"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { user, loading } = useAuth()

  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [signupData, setSignupData] = useState({ username: "", email: "", password: "" })

  const handleLogin = async () => {
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password)
      setIsLoginOpen(false)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleSignup = async () => {
    setError(null)
    try {
      const cred = await createUserWithEmailAndPassword(auth, signupData.email, signupData.password)
      if (cred.user) {
        await updateProfile(cred.user, { displayName: signupData.username })
      }
      setIsSignupOpen(false)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    setIsDropdownOpen(false)
  }

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-center px-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary"></div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
              <Sparkles className="h-5 w-5 text-secondary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground">AI Blog</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium hover:text-secondary">Home</Link>
            <Link href="/blog" className="text-sm font-medium hover:text-secondary">Blog</Link>
            <Link href="/ai-tools" className="text-sm font-medium hover:text-secondary">AI Tools</Link>
            <Link href="/about" className="text-sm font-medium hover:text-secondary">About</Link>
          </nav>

          {/* Desktop User / CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2"
                >
                  <User className="h-5 w-5" />
                  <span>{user.displayName || user.email?.split("@")[0]}</span>
                </Button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-4 py-2 text-sm hover:bg-secondary/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsLoginOpen(true)}>Sign In</Button>
                <Button size="sm" className="bg-secondary hover:bg-secondary/90" onClick={() => setIsSignupOpen(true)}>Get Started</Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="container mx-auto flex flex-col space-y-4 px-4 py-6">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link href="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link>
              <Link href="/ai-tools" onClick={() => setIsMenuOpen(false)}>AI Tools</Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
              <div className="flex flex-col space-y-2 pt-4">
                {user ? (
                  <Button variant="ghost" size="sm" className="justify-start" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout ({user.displayName || user.email?.split("@")[0]})
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={() => { setIsLoginOpen(true); setIsMenuOpen(false) }}>Sign In</Button>
                    <Button size="sm" className="bg-secondary hover:bg-secondary/90" onClick={() => { setIsSignupOpen(true); setIsMenuOpen(false) }}>Get Started</Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Auth Modals */}
      <AuthModal
        title="Sign In"
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSubmit={handleLogin}
        fields={[
          { label: "Email", type: "email", value: loginData.email, onChange: (e) => setLoginData({ ...loginData, email: e.target.value }) },
          { label: "Password", type: "password", value: loginData.password, onChange: (e) => setLoginData({ ...loginData, password: e.target.value }) },
        ]}
        error={error}
        buttonText="Sign In"
      />

      <AuthModal
        title="Sign Up"
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSubmit={handleSignup}
        fields={[
          { label: "Username", type: "text", value: signupData.username, onChange: (e) => setSignupData({ ...signupData, username: e.target.value }) },
          { label: "Email", type: "email", value: signupData.email, onChange: (e) => setSignupData({ ...signupData, email: e.target.value }) },
          { label: "Password", type: "password", value: signupData.password, onChange: (e) => setSignupData({ ...signupData, password: e.target.value }) },
        ]}
        error={error}
        buttonText="Sign Up"
      />
    </>
  )
}
