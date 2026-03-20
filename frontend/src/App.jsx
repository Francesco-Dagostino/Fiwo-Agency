import Navbar   from "./components/Navbar";
import Hero     from "./components/Hero";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Team     from "./components/Team";
import Faq      from "./components/Faq";
import Contact  from "./components/Contact";
import Footer   from "./components/Footer";
import Admin from "./components/Admin";


// Enrutado mínimo sin react-router:
// si la URL es /admin → muestra el panel, si no → muestra el sitio
const isAdmin = window.location.pathname === "/admin";

export default function App() {
  if (isAdmin) return <Admin />;

  return (
    <div className="antialiased text-stone-900">
      <Navbar />
      <Hero />
      <Services />
      <Projects />
      <Team />
      <Faq />
      <Contact />
      <Footer />
    </div>
  );
}