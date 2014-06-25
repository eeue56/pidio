import spotify

def get_session(username, password):
	session = spotify.Session()
	session.login(username, password)
	session.process_events()
	if(session.connection.state != spotify.ConnectionState.LOGGED_IN):
		return None
	
	return session	

def play_song(session, track_text_link):
	track_link = session.get_link(track_text_link)
	track = track_link.as_track()
	track.load()
	player = spotify.player.Player(session)
	player.load(track)
	player.play()
	return player


