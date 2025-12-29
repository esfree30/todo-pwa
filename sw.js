self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  clients.claim();
});

/* 알림 표시 함수 */
function showTodoNotification(todo) {
  self.registration.showNotification("⏰ 할 일 알림", {
    body: todo.text,
    icon: "icon-192.png",
    badge: "icon-192.png",
    tag: "todo-" + todo.id,
    renotify: false
  });
}

/* 메시지 수신 (페이지 → SW) */
self.addEventListener("message", event => {
  if (event.data?.type === "CHECK_TODOS") {
    const todos = event.data.todos;
    const now = new Date();

    const nowDate = now.toISOString().slice(0, 10);
    const nowTime = now.toTimeString().slice(0, 5);

    todos.forEach(todo => {
      if (
        todo.date === nowDate &&
        todo.time === nowTime &&
        !todo.notified
      ) {
        showTodoNotification(todo);
        todo.notified = true;
      }
    });

    // 다시 페이지로 상태 반환
    event.source?.postMessage({
      type: "UPDATED_TODOS",
      todos
    });
  }
});
