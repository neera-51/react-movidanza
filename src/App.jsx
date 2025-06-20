import AppRoutes from './routes/routes'; // Archivo de rutas
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/navBar/Navbar';
import Footer from './components/Footer';

function App() {
  return (

    <>
    <ScrollToTop/>

      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Navbar />

        {/* Contenido principal que se expande */}
        <main className="flex-1">
          <AppRoutes />
        </main>

        {/* Footer siempre al fondo */}
        <Footer />
      </div>
    </>

  );
}

export default App;