import { ref, watch, onMounted, onUnmounted } from 'vue';

export function useLocalStorage(key) {
  const storedValue = localStorage.getItem(key);
  const value = ref(storedValue !== null ?storedValue : "");

  watch(value, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  });

  const updateValueFromEvent = (event) => {
    if (event.key === key) {
      value.value = event.newValue !== null ? event.newValue : defaultValue;
    }
  };

  onMounted(() => {
    window.addEventListener('storage', updateValueFromEvent);
  });

  onUnmounted(() => {
    window.removeEventListener('storage', updateValueFromEvent);
  });


  return value;
}