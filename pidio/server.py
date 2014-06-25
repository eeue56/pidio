from justcolumns.wrapper import get, run

from json import dumps


songs = []
is_paused = False

@get('/')
def f(*args, **kwargs):
    return '<html><head></head><body><h1>Hello!</h1></body></html>'

@get('/add', ['track'])
def add_track(*args, **kwargs):
    global songs

    arguments = kwargs['arguments']
    track = arguments['track'][0]
    songs.append(track)

@get('/list')
def list_songs(*args, **kwargs):
    return dumps(songs)

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


@get('/search', ['text'])
def search(*args, **kwargs):
    arguments = kwargs['arguments']
    text = arguments['text'][0]

    return 



def test():
    run(8888)

def main():
    pass

if __name__ == '__main__':
    test()