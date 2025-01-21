document.addEventListener('DOMContentLoaded', function() {
    const temp203Element = document.getElementById('temp203');
    const temp202Element = document.getElementById('temp202');
    const temp302Element = document.getElementById('temp302');
    const refreshButton = document.getElementById('refreshButton');

    const MIN_TEMP_203_202 = 21.8;
    const MAX_TEMP_203_202 = 22.0;
    const MIN_TEMP_302 = 21.9;
    const MAX_TEMP_302 = 22.2;
    const CHANGE_PROBABILITY = 0.20;
    const MAX_TEMP_CHANGE = 0.1;
    const UPDATE_INTERVAL = 15000;

    let canUpdate = false;
    let lastUpdateTime = 0;
    let temperatureChange = {
        temp203: 0,
        temp202: 0,
        temp302: 0,
    };


    function generateInitialTemperature(min, max) {
        return (Math.random() * (max - min) + min).toFixed(1);
    }

    function applyAnimation(element) {
      element.style.transition = 'transform 0.2s ease';
      element.style.transform = 'scale(1.1)';
      setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.transition = 'transform 0.2s ease';
        }, 200);
    }

    function adjustTemperature(currentTemp, is302, otherTemp1, otherTemp2, roomKey) {
        const minTemp = is302 ? MIN_TEMP_302 : MIN_TEMP_203_202;
        const maxTemp = is302 ? MAX_TEMP_302 : MAX_TEMP_203_202;
        let tempChange = temperatureChange[roomKey];
        let newTemp = parseFloat(currentTemp) + tempChange;


        if (is302) {
            const maxOtherTemp = Math.max(parseFloat(otherTemp1), parseFloat(otherTemp2));
            if (newTemp < Math.max(minTemp, maxOtherTemp + 0.1))
            {
                newTemp =  Math.max(minTemp, maxOtherTemp + 0.1)
                temperatureChange[roomKey] =  0.05;
            }
        }

            if (Math.random() < CHANGE_PROBABILITY) {
                tempChange = (Math.random() * MAX_TEMP_CHANGE * 2 - MAX_TEMP_CHANGE);
                 temperatureChange[roomKey] = tempChange;
            } else {
                temperatureChange[roomKey] = tempChange * 0.5;
            }

            if (newTemp < minTemp) {
                newTemp = minTemp;
                temperatureChange[roomKey] = Math.abs(temperatureChange[roomKey])
            }  else if (newTemp > maxTemp) {
                newTemp = maxTemp;
                temperatureChange[roomKey] =  -Math.abs(temperatureChange[roomKey]);
            }

        return newTemp.toFixed(1);
    }

    function updateTemperatures() {
        if (!canUpdate) {
            return;
        }
        canUpdate = false;
        refreshButton.disabled = true;

        const temp203 = parseFloat(temp203Element.textContent.trim());
        const temp202 = parseFloat(temp202Element.textContent.trim());


        const newTemp203 = adjustTemperature(temp203, false, 0, 0, 'temp203');
        const newTemp202 = adjustTemperature(temp202, false, 0, 0, 'temp202');
        const newTemp302 = adjustTemperature(parseFloat(temp302Element.textContent.trim()), true, newTemp203, newTemp202, 'temp302');


        temp203Element.textContent = `${newTemp203}°C`;
        temp202Element.textContent = `${newTemp202}°C`;
        temp302Element.textContent = `${newTemp302}°C`;


        applyAnimation(temp203Element);
        applyAnimation(temp202Element);
        applyAnimation(temp302Element);


        lastUpdateTime = Date.now();


        setTimeout(() => {
          canUpdate = true;
          refreshButton.disabled = false;
          refreshButton.textContent = "Обновить"; // Заменено
        }, UPDATE_INTERVAL);

         refreshButton.textContent = "Обновление..."; // Заменено
    }


     // Устанавливаем начальную температуру при загрузке страницы
    temp203Element.textContent = `${generateInitialTemperature(MIN_TEMP_203_202, MAX_TEMP_203_202)}°C`;
    temp202Element.textContent = `${generateInitialTemperature(MIN_TEMP_203_202, MAX_TEMP_203_202)}°C`;
    temp302Element.textContent = `${generateInitialTemperature(MIN_TEMP_302, MAX_TEMP_302)}°C`;

    // Изначально разрешаем обновление
    canUpdate = true;

    // Устанавливаем начальную блокировку на 15 секунд
     refreshButton.disabled = true;
    setTimeout(() => {
        refreshButton.disabled = false;
         lastUpdateTime = Date.now();
    }, UPDATE_INTERVAL);

    refreshButton.addEventListener('click', updateTemperatures);
});
