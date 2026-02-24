
    document.getElementById("contactForm").addEventListener("submit", function(e) {
        e.preventDefault(); // prevent page reload

    // Get values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Create message object
    const newMessage = {
        name: name,
    email: email,
    subject: subject,
    message: message,
    date: new Date().toLocaleString()
  };

    // Get existing messages or empty array
    let messages = JSON.parse(localStorage.getItem("contactMessages")) || [];

    // Add new message
    messages.push(newMessage);

    // Save back to localStorage
    localStorage.setItem("contactMessages", JSON.stringify(messages));

    // Show success alert
    alert("Message saved successfully!");

    // Reset form
    document.getElementById("contactForm").reset();
});
