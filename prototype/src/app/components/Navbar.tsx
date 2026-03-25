import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button, cn } from "./UI";
import { Briefcase, User, LayoutDashboard, LogOut, Menu, X, Bell, PlusCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isHR = user?.role === "company";
  const isCandidate = user?.role === "candidate";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={cn(
          "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white transform group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold font-poppins text-foreground tracking-tight">
              Future<span className="text-primary">Career</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/search">ค้นหางาน</NavLink>
            {isCandidate && <NavLink to="/profile">โปรไฟล์ของฉัน</NavLink>}
            {isHR && (
              <>
                <NavLink to="/hr/dashboard">แดชบอร์ด</NavLink>
                <NavLink to="/hr/jobs">จัดการประกาศงาน</NavLink>
                <NavLink to="/hr/feed">Company Feed</NavLink>
              </>
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
              </button>
              
              {isHR && (
                <Link to="/hr/jobs">
                  <Button size="sm" className="gap-2">
                    <PlusCircle className="w-4 h-4" />
                    สร้างประกาศงาน
                  </Button>
                </Link>
              )}

              <div className="h-8 w-px bg-border"></div>

              <div className="flex items-center gap-3 pl-2">
                <div className="text-right">
                  <p className="text-sm font-semibold leading-none">{user.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">{user.role}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 overflow-hidden">
                  <User className="w-5 h-5" />
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">เข้าสู่ระบบ</Button>
              </Link>
              <Link to="/register">
                <Button>สมัครสมาชิก</Button>
              </Link>
              <div className="h-6 w-px bg-border mx-2"></div>
              <Link to="/hr/login">
                <Button variant="secondary">สำหรับบริษัท</Button>
              </Link>
            </>
          )}
        </div>

        <button onClick={toggleMenu} className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors">
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-border overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              <Link to="/search" onClick={toggleMenu} className="text-lg font-medium">ค้นหางาน</Link>
              {isCandidate && (
                <Link to="/profile" onClick={toggleMenu} className="text-lg font-medium">โปรไฟล์ของฉัน</Link>
              )}
              {isHR && (
                <>
                  <Link to="/hr/dashboard" onClick={toggleMenu} className="text-lg font-medium">แดชบอร์ด</Link>
                  <Link to="/hr/jobs" onClick={toggleMenu} className="text-lg font-medium">จัดการประกาศงาน</Link>
                  <Link to="/hr/feed" onClick={toggleMenu} className="text-lg font-medium">Company Feed</Link>
                </>
              )}
              <hr className="border-border" />
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => { logout(); toggleMenu(); }} className="w-full gap-2">
                    <LogOut className="w-4 h-4" /> ออกจากระบบ
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" onClick={toggleMenu}>
                    <Button variant="outline" className="w-full">เข้าสู่ระบบ</Button>
                  </Link>
                  <Link to="/register" onClick={toggleMenu}>
                    <Button className="w-full">สมัครสมาชิก</Button>
                  </Link>
                  <Link to="/hr/login" onClick={toggleMenu}>
                    <Button variant="secondary" className="w-full">สำหรับบริษัท</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
