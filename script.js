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

    // --- Functions ---
    function displayQRCode(textToEncode, width = 200, height = 200, isForCoinPromotion = false) {
        qrCodeDivEl.innerHTML = "";
        try {
            qrcodeInstance = new QRCode(qrCodeDivEl, {
                text: textToEncode,
                width: width,
                height: height,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (error) {
            console.error("QRCode generation error:", error);
            Swal.fire('Error', 'Could not generate QR code.', 'error');
            return;
        }

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
                Swal.fire({ title: 'Input Required', text: 'Please enter text or a URL.', icon: 'warning', confirmButtonText: 'OK' });
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
             Swal.fire({ title: 'Copied!', text: 'Contract Address copied!', icon: 'success', timer: 2000, showConfirmButton: false, toast:true, position:'top-end' });
             e.clearSelection();
        });
        clipboardCA.on('error', function (e) {
             Swal.fire({ title: 'Copy Failed', text: 'Please try manually.', icon: 'error', confirmButtonText: 'OK' });
        });
    }

    if (shareGeneratedQRBtn) {
        shareGeneratedQRBtn.addEventListener("click", function () {
            if (qrcodeInstance && currentGeneratedQRDataForSharing) {
                let shareTextContent;
                let finalShareUrl;

                if (isCustomUserQRDisplayed) {
                    let userContentPreview = currentGeneratedQRDataForSharing;
                    if (userContentPreview.length > 20) userContentPreview = userContentPreview.substring(0,17) + '...';

                    shareTextContent = `I just created a QR for "${userContentPreview}" with ${COIN_NAME}'s tool! Check out $${COIN_SYMBOL} & create yours: ${COIN_WEBSITE_URL} ${PROMOTIONAL_HASHTAGS}`;
                    finalShareUrl = COIN_WEBSITE_URL;
                } else {
                    shareTextContent = `🚀 Join ${COIN_NAME} ($${COIN_SYMBOL})! Scan to buy on pump.fun or visit: ${currentGeneratedQRDataForSharing} ${PROMOTIONAL_HASHTAGS}`;
                    finalShareUrl = currentGeneratedQRDataForSharing;
                }

                const shareData = {
                    title: `Shared via ${COIN_NAME} | $${COIN_SYMBOL}`,
                    text: shareTextContent,
                    url: finalShareUrl
                };

                if (navigator.share && typeof navigator.share === 'function') {
                    navigator.share(shareData)
                        .then(() => console.log('Successfully shared'))
                        .catch((error) => {
                            console.log('Error sharing via navigator.share:', error);
                            fallbackShare(shareData);
                        });
                } else {
                    fallbackShare(shareData);
                }
            } else {
                Swal.fire({ title: 'No QR Code!', text: 'Please generate a QR code first.', icon: 'warning', confirmButtonText: 'OK' });
            }
        });
    }

    function fallbackShare(shareData) {
        const twitterText = shareData.text;
        const twitterUrl = shareData.url;
        const twitterShareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(twitterUrl)}`;

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
