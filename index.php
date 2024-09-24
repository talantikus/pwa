<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PWA Full Features Demo</title>
    <link rel="manifest" href="manifest.json">
</head>
<body>
    <h1>PWA Full Features Demo</h1>

    <!-- Геолокация -->
    <button onclick="getLocation()">Геолокация</button>
    <p id="location"></p>

    <!-- Камера -->
    <button onclick="openCamera()">Открыть камеру</button>
    <video id="camera-stream" width="300" height="200" autoplay></video>

    <!-- Микрофон -->
    <button onclick="recordAudio()">Запись звука</button>
    <audio id="audio-playback" controls></audio>

    <!-- Контакты -->
    <button onclick="getContacts()">Получить контакты</button>
    <ul id="contacts"></ul>

    <!-- Вызов -->
    <button onclick="makeCall()">Совершить вызов</button>

    <!-- Уведомления -->
    <button onclick="requestNotification()">Запросить уведомления</button>

    <!-- NFC -->
    <button onclick="readNFC()">Сканировать NFC</button>

    <!-- Bluetooth -->
    <button onclick="connectBluetooth()">Подключиться к Bluetooth</button>

    <!-- Копирование текста -->
    <button onclick="copyToClipboard()">Скопировать текст</button>
    <textarea id="clipboard-text" placeholder="Введите текст для копирования"></textarea>

    <!-- Загрузка файлов -->
    <input type="file" id="file-input" onchange="readFile()">
    <pre id="file-content"></pre>

    <script src="app.js"></script>
</body>
</html>
