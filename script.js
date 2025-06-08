document.addEventListener('DOMContentLoaded', function () {
    // --- CONFIGURATION: REPLACE THESE PLACEHOLDERS AFTER COIN CREATION ---
    const PUMP_FUN_LINK_PLACEHOLDER = "YOUR_PUMP_FUN_LINK_HERE";
    const COIN_CONTRACT_ADDRESS_PLACEHOLDER = "YOUR_COIN_CONTRACT_ADDRESS_HERE";
    const X_PROFILE_LINK_PLACEHOLDER = "YOUR_X_PROFILE_LINK_HERE";
    const TELEGRAM_LINK_PLACEHOLDER = "YOUR_TELEGRAM_LINK_HERE";

    const COIN_NAME = "QR Coin";
    const COIN_SYMBOL = "QRC";
    const COIN_WEBSITE_URL = window.location.href; // Or your actual domain
    const PROMOTIONAL_HASHTAGS = `#${COIN_SYMBOL} #${COIN_NAME.replace(/\s+/g, '')} #Solana #MemeCoin #ScanTheFuture`;
    // --- END OF CONFIGURATION ---

    // --- Get Elements ---
    const inputTextEl = document.getElementById("inputText");
    const generateBtn = document.getElementById("generateBtn");
    const generateCoinQRBtn = document.getElementById("generateCoinQRBtn");
    const qrCodeContainerEl = document.getElementById("qrCodeContainer");
    const qrCodeDivEl = document.getElementById("qrCode");
    const shareGeneratedQRBtn = document.getElementById("shareGeneratedQRBtn");
    const downloadGeneratedQRBtn = document.getElementById("downloadGeneratedQRBtn");
    const shareContextTextEl = document.getElementById("shareContextText");
    const contractAddressInputEl = document.getElementById("contractAddress");
    const buyCoinLinkEl = document.getElementById("buyCoinLink");
    const pumpLinkInHowToBuyEl = document.getElementById("pumpLinkInHowToBuy");
    const twitterLinkEl = document.getElementById("twitterLink");
    const telegramLinkEl = document.getElementById("telegramLink");
    const currentYearEl = document.getElementById("currentYear");
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

    // --- Update Dynamic Elements ---
    if (buyCoinLinkEl && PUMP_FUN_LINK_PLACEHOLDER !== "YOUR_PUMP_FUN_LINK_HERE" && PUMP_FUN_LINK_PLACEHOLDER) {
        buyCoinLinkEl.href = PUMP_FUN_LINK_PLACEHOLDER;
    }
     if (pumpLinkInHowToBuyEl && PUMP_FUN_LINK_PLACEHOLDER !== "YOUR_PUMP_FUN_LINK_HERE" && PUMP_FUN_LINK_PLACEHOLDER) {
        pumpLinkInHowToBuyEl.href = PUMP_FUN_LINK_PLACEHOLDER;
    }
    if (contractAddressInputEl && COIN_CONTRACT_ADDRESS_PLACEHOLDER !== "YOUR_COIN_CONTRACT_ADDRESS_HERE" && COIN_CONTRACT_ADDRESS_PLACEHOLDER) {
        contractAddressInputEl.value = COIN_CONTRACT_ADDRESS_PLACEHOLDER;
    }
    if (twitterLinkEl && X_PROFILE_LINK_PLACEHOLDER !== "YOUR_X_PROFILE_LINK_HERE" && X_PROFILE_LINK_PLACEHOLDER) {
        twitterLinkEl.href = X_PROFILE_LINK_PLACEHOLDER;
    }
    if (telegramLinkEl && TELEGRAM_LINK_PLACEHOLDER !== "YOUR_TELEGRAM_LINK_HERE" && TELEGRAM_LINK_PLACEHOLDER) {
        telegramLinkEl.href = TELEGRAM_LINK_PLACEHOLDER;
    }
    if(currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // --- Variables ---
    let qrcodeInstance = null;
    let currentGeneratedQRDataForSharing = null;
    let isCustomUserQRDisplayed = false;
    let currentQRImageData = null; // Store the actual image data

    // --- Functions ---
    // --- FINAL, CORRECTED QR Code Display Function with Margin ---
// --- FINAL, ROBUST QR Code Function with Guaranteed White Margin ---
function displayQRCode(textToEncode, width = 200, height = 200, isForCoinPromotion = false) {
    // Clear previous results
    qrCodeDivEl.innerHTML = "";
    currentQRImageData = null; 
    
    try {
        // Step 1: Generate the QR code in a temporary, off-screen div.
        // This isolates the library's output from our main page.
        const tempDiv = document.createElement('div');
        tempDiv.style.display = 'none'; // Keep it hidden
        document.body.appendChild(tempDiv);

        new QRCode(tempDiv, {
            text: textToEncode,
            width: width,
            height: height,
            colorDark: "#000000",
            colorLight: "#ffffff", // Important for the QR's own background
            correctLevel: QRCode.CorrectLevel.H
        });

        // Use a small delay to ensure the QRCode library has finished drawing.
        setTimeout(() => {
            // Find the generated element, whether it's a <canvas> or an <img>
            const sourceElement = tempDiv.querySelector('canvas, img');

            if (sourceElement) {
                // Step 2: Create a new, larger canvas to be our final image.
                const canvasWithMargin = document.createElement('canvas');
                const ctx = canvasWithMargin.getContext('2d');
                
                // --- INCREASED MARGIN: Make the white border larger ---
                const margin = 25; // Increased from 15 to 25 pixels for better scanning.

                // Set the final dimensions including the margin
                canvasWithMargin.width = width + margin * 2;
                canvasWithMargin.height = height + margin * 2;

                // --- GUARANTEED WHITE BACKGROUND: This is the critical fix ---
                // First, set the fill color to white.
                ctx.fillStyle = '#ffffff';
                // Then, draw a white rectangle that covers the entire canvas.
                ctx.fillRect(0, 0, canvasWithMargin.width, canvasWithMargin.height);

                // Step 3: Draw the original QR code onto the center of our new white canvas.
                // The drawImage function works for both <canvas> and <img> sources.
                ctx.drawImage(sourceElement, margin, margin);

                // Step 4: Use the new image (with the white margin) for everything.
                const finalImageDataUrl = canvasWithMargin.toDataURL('image/png');

                // Set the image for display on the webpage
                const displayImg = document.createElement('img');
                displayImg.src = finalImageDataUrl;
                qrCodeDivEl.appendChild(displayImg);

                // Store the same image data for the download/share buttons
                currentQRImageData = finalImageDataUrl;
                
                console.log('Successfully generated QR code with a large, white margin.');
            } else {
                console.error("QRCode library failed to generate a canvas or img element.");
                Swal.fire('Error', 'Could not process the generated QR code.', 'error');
            }

            // Clean up the temporary div from the document
            document.body.removeChild(tempDiv);

            // Show the UI elements as before
            qrCodeContainerEl.style.display = "block";
            isCustomUserQRDisplayed = !isForCoinPromotion;
            currentGeneratedQRDataForSharing = textToEncode;

            if (isForCoinPromotion) {
                shareContextTextEl.textContent = `Sharing a QR for ${COIN_NAME}!`;
            } else {
                shareContextTextEl.textContent = `Sharing your custom QR (and promoting ${COIN_NAME}!)`;
            }
            shareContextTextEl.style.display = "block";
            shareGeneratedQRBtn.style.display = "inline-block";
            downloadGeneratedQRBtn.style.display = "inline-block";

        }, 100); // Increased delay slightly for more reliability

    } catch (error) {
        console.error("QRCode generation error:", error);
        Swal.fire('Error', 'Could not generate QR code.', 'error');
    }
}

    
}

    // Helper function to get QR image data
    function getQRImageData() {
        // First check if we have stored image data
        if (currentQRImageData) {
            return currentQRImageData;
        }

        // Try to get from img element
        const img = qrCodeDivEl.querySelector('img');
        if (img && img.src && img.complete) {
            currentQRImageData = img.src;
            return currentQRImageData;
        }

        // Try to get from canvas
        const canvas = qrCodeDivEl.querySelector('canvas');
        if (canvas) {
            currentQRImageData = canvas.toDataURL();
            return currentQRImageData;
        }

        return null;
    }

    // --- Event Listeners ---
    if (generateBtn) {
        generateBtn.addEventListener("click", function () {
            const text = inputTextEl.value.trim();
            if (text) {
                displayQRCode(text, 200, 200, false);
                Swal.fire({
                    title: 'Custom QR Generated!',
                    text: 'Your custom QR code is ready.',
                    icon: 'success',
                    confirmButtonText: 'Awesome!'
                });
            } else {
                Swal.fire({ 
                    title: 'Input Required', 
                    text: 'Please enter text or a URL.', 
                    icon: 'warning', 
                    confirmButtonText: 'OK' 
                });
            }
        });
    }

    if (generateCoinQRBtn) {
        generateCoinQRBtn.addEventListener("click", function() {
            const effectivePumpLink = (PUMP_FUN_LINK_PLACEHOLDER === "YOUR_PUMP_FUN_LINK_HERE" || !PUMP_FUN_LINK_PLACEHOLDER) ? COIN_WEBSITE_URL : PUMP_FUN_LINK_PLACEHOLDER;
            displayQRCode(effectivePumpLink, 200, 200, true);
            Swal.fire({
                title: `${COIN_NAME} QR Ready!`,
                html: `Scan or share this QR for ${COIN_NAME}!`,
                icon: 'success',
                confirmButtonText: 'Great!'
            });
        });
    }

    if (document.getElementById('copyCaBtn') && contractAddressInputEl) {
        const clipboardCA = new ClipboardJS('#copyCaBtn');
        clipboardCA.on('success', function (e) {
             Swal.fire({ 
                 title: 'Copied!', 
                 text: 'Contract Address copied!', 
                 icon: 'success', 
                 timer: 2000, 
                 showConfirmButton: false, 
                 toast: true, 
                 position: 'top-end' 
             });
             e.clearSelection();
        });
        clipboardCA.on('error', function (e) {
             Swal.fire({ 
                 title: 'Copy Failed', 
                 text: 'Please try manually.', 
                 icon: 'error', 
                 confirmButtonText: 'OK' 
             });
        });
    }

    // === UPDATED SHARE LOGIC ===
    if (shareGeneratedQRBtn) {
        shareGeneratedQRBtn.addEventListener("click", async function () {
            // Check if we have QR data
            if (!currentGeneratedQRDataForSharing) {
                Swal.fire({ 
                    title: 'No QR Code!', 
                    text: 'Please generate a QR code first.', 
                    icon: 'warning', 
                    confirmButtonText: 'OK' 
                });
                return;
            }

            const imageData = getQRImageData();
            if (!imageData) {
                Swal.fire({ 
                    title: 'Please wait...', 
                    text: 'QR code is still being generated. Try again in a moment.', 
                    icon: 'info', 
                    confirmButtonText: 'OK' 
                });
                return;
            }

            try {
                let shareTextContent;
                let finalShareUrl;

                if (isCustomUserQRDisplayed) {
                    let userContentPreview = currentGeneratedQRDataForSharing;
                    if (userContentPreview.length > 20) userContentPreview = userContentPreview.substring(0, 17) + '...';
                    shareTextContent = `I just created a QR for "${userContentPreview}" with ${COIN_NAME}'s tool! Check out $${COIN_SYMBOL} & create yours: ${COIN_WEBSITE_URL} ${PROMOTIONAL_HASHTAGS}`;
                    finalShareUrl = COIN_WEBSITE_URL;
                } else {
                    shareTextContent = `🚀 Join ${COIN_NAME} ($${COIN_SYMBOL})! Scan to buy on pump.fun or visit: ${currentGeneratedQRDataForSharing} ${PROMOTIONAL_HASHTAGS}`;
                    finalShareUrl = currentGeneratedQRDataForSharing;
                }

                // Convert data URL to blob
                const response = await fetch(imageData);
                const blob = await response.blob();
                const file = new File([blob], 'qrc-code.png', { type: 'image/png' });
                
                const shareData = {
                    title: `Shared via ${COIN_NAME} | $${COIN_SYMBOL}`,
                    text: shareTextContent,
                    url: finalShareUrl,
                    files: [file]
                };

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share(shareData);
                } else {
                    console.log("File sharing not supported, falling back to text/URL share.");
                    if (navigator.share) {
                        await navigator.share({
                            title: shareData.title,
                            text: shareData.text,
                            url: shareData.url
                        });
                    } else {
                        fallbackShare({
                            text: shareTextContent,
                            url: finalShareUrl
                        });
                    }
                }
            } catch (error) {
                console.error('Error sharing:', error);
                fallbackShare({
                    text: `🚀 Join ${COIN_NAME} ($${COIN_SYMBOL})! Scan to buy on pump.fun or visit the site.`,
                    url: currentGeneratedQRDataForSharing
                });
            }
        });
    }

    // === UPDATED DOWNLOAD BUTTON LOGIC ===
    if (downloadGeneratedQRBtn) {
        downloadGeneratedQRBtn.addEventListener("click", function() {
            // Check if we have QR data
            if (!currentGeneratedQRDataForSharing) {
                Swal.fire({
                    title: 'No QR Code!', 
                    text: 'Please generate a QR code first.', 
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
                return;
            }

            const imageData = getQRImageData();
            if (!imageData) {
                Swal.fire({
                    title: 'Please wait...', 
                    text: 'QR code is still being generated. Try again in a moment.', 
                    icon: 'info',
                    confirmButtonText: 'OK'
                });
                return;
            }

            try {
                const link = document.createElement('a');
                link.href = imageData;
                link.download = 'qrc-generated-code.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                Swal.fire({ 
                    title: 'Download Started!', 
                    text: 'Your QR code image is being downloaded.', 
                    icon: 'success', 
                    timer: 2000, 
                    showConfirmButton: false 
                });
            } catch (error) {
                console.error('Download error:', error);
                Swal.fire({
                    title: 'Download Failed', 
                    text: 'There was an error downloading the QR code.', 
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        });
    }

    function fallbackShare(shareData) {
        const twitterShareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
         Swal.fire({
            title: 'Share This!',
            html: `
                <p>Your browser doesn't support direct sharing. You can share this link:</p>
                <p class="mb-2 user-select-all"><strong>${shareData.url}</strong></p>
                <p>Or share on X (Twitter):</p>
                <a href="${twitterShareLink}" target="_blank" rel="noopener noreferrer" class="btn btn-dark btn-sm"><i class="fab fa-twitter"></i> Share on X</a>
            `,
            icon: 'info'
        });
    }

    // Smooth scroll and other utility functions
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1 && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if(targetElement) {
                    const headerEl = document.querySelector('header');
                    const headerOffset = headerEl ? headerEl.offsetHeight : 60;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 15;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                }
            }
        });
    });

    if (scrollToTopBtn) {
        window.onscroll = function() {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                scrollToTopBtn.style.display = "block";
            } else {
                scrollToTopBtn.style.display = "none";
            }
        };
    }
});
