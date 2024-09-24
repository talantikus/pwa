// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Service Worker зарегистрирован:', reg))
        .catch(err => console.error('Service Worker не зарегистрирован:', err));
    });
  }
  
  // Геолокация
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        document.getElementById('location').textContent = 
          `Широта: ${position.coords.latitude}, Долгота: ${position.coords.longitude}`;
      });
    } else {
      alert('Геолокация не поддерживается в этом браузере');
    }
  }
  
  // Камера
  function openCamera() {
    const video = document.getElementById('camera-stream');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
        })
        .catch(err => console.error('Ошибка при доступе к камере:', err));
    } else {
      alert('Камера не поддерживается в этом браузере');
    }
  }
  
  // Микрофон (Запись звука)
  function recordAudio() {
    const audio = document.getElementById('audio-playback');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.start();
  
          const audioChunks = [];
          mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
  
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks);
            audio.src = URL.createObjectURL(audioBlob);
          };
  
          setTimeout(() => {
            mediaRecorder.stop();
          }, 3000); // Запись в течение 3 секунд
        });
    } else {
      alert('Микрофон не поддерживается в этом браузере');
    }
  }
  
  // Получение контактов
  async function getContacts() {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      const contacts = await navigator.contacts.select(['name', 'tel'], { multiple: true });
      const contactsList = document.getElementById('contacts');
      contacts.forEach(contact => {
        const li = document.createElement('li');
        li.textContent = `${contact.name}: ${contact.tel}`;
        contactsList.appendChild(li);
      });
    } else {
      alert('API контактов не поддерживается');
    }
  }
  
  // Совершение вызова
  function makeCall() {
    const tel = prompt('Введите номер для вызова:');
    if (tel) {
      window.location.href = `tel:${tel}`;
    }
  }
  
  // Уведомления
  function requestNotification() {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("Это тестовое уведомление!");
        }
      });
    } else {
      alert('Уведомления не поддерживаются в этом браузере');
    }
  }
  
  // NFC (Требуется поддержка в браузере и устройстве)
  function readNFC() {
    if ('NFC' in window) {
      const nfc = new window.NFC();
      nfc.onreading = event => {
        alert(`NFC данные считаны: ${event.serialNumber}`);
      };
    } else {
      alert('NFC не поддерживается в этом браузере');
    }
  }
  
  // Bluetooth подключение
  async function connectBluetooth() {
    try {
      const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
      const server = await device.gatt.connect();
      alert(`Подключено к ${device.name}`);
    } catch (error) {
      console.error('Ошибка подключения к Bluetooth:', error);
    }
  }
  
  // Копирование текста в буфер обмена
  function copyToClipboard() {
    const text = document.getElementById('clipboard-text').value;
    navigator.clipboard.writeText(text).then(() => {
      alert('Текст скопирован!');
    }).catch(err => {
      console.error('Ошибка при копировании текста:', err);
    });
  }
  
  // Чтение файла
  function readFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        document.getElementById('file-content').textContent = event.target.result;
      };
      reader.readAsText(file);
    }
  }
  