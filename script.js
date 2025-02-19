document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = "https://encryption-api-hpa6.onrender.com/encrypt";

    async function encryptMessage(message) {
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: message })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Encryption failed");
            return data.encrypted;
        } catch (error) {
            console.error("Error during encryption:", error);
            alert("Encryption failed. Please try again.");
        }
    }

    async function generateQRCode() {
        const messageInput = document.getElementById("messageInput").value.trim();

        if (!messageInput) {
            alert("Please enter a message to encrypt.");
            return;
        }

        const encryptedMessage = await encryptMessage(messageInput);
        if (!encryptedMessage) return;

        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=225x225&data=${encodeURIComponent(encryptedMessage)}`;

        document.getElementById("qrImage").src = qrCodeUrl;
        document.getElementById("encryptSection").style.display = 'none';
        document.getElementById("qrPopup").classList.add("show-img");
    }

    async function downloadQRCode() {
        const qrImage = document.getElementById("qrImage");
        try {
            const response = await fetch(qrImage.src);
            const blob = await response.blob();

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "encrypted_qr_code.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            alert('QR Code downloaded successfully!');
        } catch (error) {
            console.error("Error downloading QR Code:", error);
            alert("Failed to download QR Code.");
        }
    }

    function resetForm() {
        document.getElementById("encryptSection").style.display = 'block';
        document.getElementById("qrPopup").classList.remove("show-img");
        document.getElementById("messageInput").value = '';
    }

    document.getElementById('generateBtn').addEventListener('click', generateQRCode);
    document.getElementById('downloadBtn').addEventListener('click', downloadQRCode);
    document.getElementById('generateAgain').addEventListener('click', resetForm);
});