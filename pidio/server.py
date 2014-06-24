from wrapper import get, run


songs = []
is_paused = False

@get('/')
def f(*args, **kwargs):
    return '<html><head></head><body><h1>Hello!</h1></body></html>'

@get('/add', 'track')
def add_track(*args, **kwargs):
    global songs

    arguments = kwargs['arguments']
    track = arguments['track'][0]
    songs.append(track)

@get('/pause')
def pause(*args, **kwargs):
    global is_paused
    is_paused = True

@get('/play')
def play(*args, **kwargs):
    global is_paused
    is_paused = False

@get('/toggle')
def toggle(*args, **kwargs):
    global is_paused
    is_paused = not is_paused



def test():
    run(8888)

def main():
    pass

if __name__ == '__main__':
    test()