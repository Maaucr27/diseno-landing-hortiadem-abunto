export default function WhatsAppButton() {
  const phone = "50689413752"; // tu número con código de país, sin +
  const message = encodeURIComponent("Hola, quiero información sobre sus productos");
  
  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#25D366",
        color: "white",
        padding: "14px 20px",
        borderRadius: "50px",
        fontWeight: "bold",
        textDecoration: "none",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        zIndex: 9999,
      }}
    >
      WhatsApp
    </a>
  );
}
