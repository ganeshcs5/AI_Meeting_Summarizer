document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadForm');
    const youtubeForm = document.getElementById('youtubeForm');
    const audioFileInput = document.getElementById('audioFile');
    const youtubeUrlInput = document.getElementById('youtubeUrl');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');

    // Handle file upload
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const file = audioFileInput.files[0];
        if (!file) {
            alert('Please select an audio file');
            return;
        }

        const formData = new FormData();
        formData.append('audio', file);

        try {
            showLoading();
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            displayResults(data);
        } catch (error) {
            console.error('Error:', error);
            alert('Error processing file. Please try again.');
        } finally {
            hideLoading();
        }
    });

    // Handle YouTube URL submission
    youtubeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = youtubeUrlInput.value.trim();
        if (!url) {
            alert('Please enter a YouTube URL');
            return;
        }

        try {
            showLoading();
            const response = await fetch('/api/youtube', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });

            if (!response.ok) {
                throw new Error('Processing failed');
            }

            const data = await response.json();
            displayResults(data);
        } catch (error) {
            console.error('Error:', error);
            alert('Error processing YouTube video. Please try again.');
        } finally {
            hideLoading();
        }
    });

    // Drag and drop functionality
    const dropZone = document.querySelector('.border-dashed');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropZone.classList.add('border-blue-500');
    }

    function unhighlight(e) {
        dropZone.classList.remove('border-blue-500');
    }

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        audioFileInput.files = files;
    }

    // Helper functions
    function showLoading() {
        loadingDiv.classList.remove('hidden');
        resultsDiv.classList.add('hidden');
    }

    function hideLoading() {
        loadingDiv.classList.add('hidden');
    }

    function displayResults(data) {
        const summaryElement = document.getElementById('summary');
        const actionItemsElement = document.getElementById('actionItems');
        const sentimentElement = document.getElementById('sentiment');

        summaryElement.textContent = data.summary || 'No summary available';
        
        if (data.actionItems && data.actionItems.length > 0) {
            actionItemsElement.innerHTML = data.actionItems
                .map(item => `<li>${item}</li>`)
                .join('');
        } else {
            actionItemsElement.innerHTML = '<li>No action items found</li>';
        }

        sentimentElement.textContent = data.sentiment || 'No sentiment analysis available';
        
        resultsDiv.classList.remove('hidden');
    }
}); 