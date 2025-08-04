 document.addEventListener('DOMContentLoaded', function () {
            // Set current year in footer
            document.getElementById('year').textContent = new Date().getFullYear();

            // DOM elements
            const fileInput = document.getElementById('file-input');
            const browseBtn = document.getElementById('browse-btn');
            const dropArea = document.getElementById('drop-area');
            const convertBtn = document.getElementById('convert-btn');
            const preview = document.getElementById('preview');
            const previewImage = document.getElementById('preview-image');
            const result = document.getElementById('result');
            const downloadBtn = document.getElementById('download-btn');
            const loading = document.getElementById('loading');
            const form = document.getElementById('converter-form');

            let convertedBlob = null;

            // Handle browse button click
            browseBtn.addEventListener('click', function () {
                fileInput.click();
            });

            // Handle file selection
            fileInput.addEventListener('change', function (e) {
                if (e.target.files.length) {
                    handleFile(e.target.files[0]);
                }
            });




            dropArea.addEventListener('drop', function (e) {
                const dt = e.dataTransfer;
                const file = dt.files[0];
                if (file) {
                    handleFile(file);
                }
            });

            // Handle the selected file
            function handleFile(file) {
                // Check if file is PNG
                if (!file.type.match('image/png')) {
                    alert('Please select a PNG image file.');
                    return;
                }

                // Enable convert button
                convertBtn.disabled = false;

                // Show preview
                const reader = new FileReader();
                reader.onload = function (e) {
                    previewImage.src = e.target.result;
                    preview.style.display = 'block';
                    result.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }

            // Handle form submission
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                if (!fileInput.files.length) return;

                const file = fileInput.files[0];

                // Show loading indicator
                loading.style.display = 'block';
                convertBtn.disabled = true;

                // Process image (simulated with setTimeout for demo)
                setTimeout(() => {
                    convertImage(file)
                        .then(blob => {
                            convertedBlob = blob;
                            loading.style.display = 'none';
                            result.style.display = 'block';
                            convertBtn.disabled = false;
                        })
                        .catch(error => {
                            console.error('Conversion error:', error);
                            alert('Error converting image. Please try again.');
                            loading.style.display = 'none';
                            convertBtn.disabled = false;
                        });
                }, 1000);
            });

            // Download converted image
            downloadBtn.addEventListener('click', function () {
                if (convertedBlob) {
                    const url = URL.createObjectURL(convertedBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'converted.jpg';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
            });

            // Image conversion function
            function convertImage(file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const img = new Image();
                        img.onload = function () {
                            const canvas = document.createElement('canvas');
                            canvas.width = img.width;
                            canvas.height = img.height;

                            const ctx = canvas.getContext('2d');

                            // Draw the image
                            ctx.drawImage(img, 0, 0);

                            // Convert to JPG with default quality
                            canvas.toBlob(function (blob) {
                                if (blob) {
                                    resolve(blob);
                                } else {
                                    reject(new Error('Conversion failed'));
                                }
                            }, 'image/jpeg');
                        };

                        img.onerror = function () {
                            reject(new Error('Image loading error'));
                        };

                        img.src = e.target.result;
                    };

                    reader.onerror = function () {
                        reject(new Error('File reading error'));
                    };

                    reader.readAsDataURL(file);
                });
            }
        });