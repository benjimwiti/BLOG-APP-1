import threading


def debounce(wait):
    """Decorator that will postpone a function's execution until after wait seconds have elapsed
    since the last time it was invoked."""
    def decorator(fn):
        timer = None
        lock = threading.Lock()

        def debounced(*args, **kwargs):
            nonlocal timer

            def call_it():
                with lock:
                    fn(*args, **kwargs)
                    timer = None

            with lock:
                if timer is not None:
                    timer.cancel()
                timer = threading.Timer(wait, call_it)
                timer.start()

        return debounced

    return decorator
