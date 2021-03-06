(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        
        /**
        * @desc Current album info
        * @type {Object}
        */
        var currentAlbum = Fixtures.getAlbum();
        
        /**
        * @desc Buzz object audio file
        * @type {Object}
        */
        var currentBuzzObject = null;
		
        /**        
        * @function setSong
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {Object} song
        */       
        var setSong = function(song) {
            if (currentBuzzObject) {
				stopSong(SongPlayer.currentSong);
            }
            
            currentBuzzObject = new buzz.sound(song.audioURL, {
                formats: ['mp3'],
                preload: true
            });
			
			currentBuzzObject.bind('timeupdate', function() {
				$rootScope.$apply(function() {
					SongPlayer.currentTime = currentBuzzObject.getTime();
				});
			}).bind('ended', function() {
                SongPlayer.next();
            });
            
            SongPlayer.currentSong = song;
        };
		
		/**
		* @function playSong
		* @desc encapsulates song playing behavior
		* @param {Object} song
		*/
		var playSong = function(song) {
			currentBuzzObject.play();
			song.playing = true;
		};
		
		/**
		* @function stopSong
		* @desc encapsulates song stopping behavior
		* @param {Object} song
		*/
		var stopSong = function(song) {
			currentBuzzObject.stop();
			song.playing = null;
		};
        
        /**
        * @function getSongIndex
        * @desc keeps track of the index of song in list of songs
        * @param {Object} song
        * @returns {Number}
        */
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };

        /**
        * @desc currently selected song from song list
        * @type {Object}
        */
        SongPlayer.currentSong = null;
		
		/**
		* @desc Current playback time (in seconds) of currently playing song
		* @type {Number}
		*/
		SongPlayer.currentTime = null;
		
		/**
		* @desc current volume level of currently playing song out of 100. default 80.
		* @type {Number}
		*/
		SongPlayer.volume = 80;
		
        /**
        * @function SongPlayer.play
        * @desc plays song and updates song info as needed
        * @param {Object} song
        */
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
				playSong(song);
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
                }
            }
        };
        
        /**
        * @function SongPlayer.pause
        * @desc pauses song and updates song info as needed
        * @param {Object} song
        */
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
        
        /**
        * @function SongPlayer.previous
        * @desc selects previous song in song list and plays/pauses accordingly
        */
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
            
            if (currentSongIndex < 0) {
				stopSong(SongPlayer.currentSong);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
		
		/**
		* @function SongPlayer.next
		* @desc selects next song in song list and plays/pauses accoordingly
        */
		SongPlayer.next = function() {
			var currentSongIndex = getSongIndex(SongPlayer.currentSong);
			currentSongIndex++;
			
			if (currentSongIndex >= currentAlbum.songs.length) {
				stopSong(SongPlayer.currentSong);
                setSong(currentAlbum.songs[0]);
			} else {
				var song = currentAlbum.songs[currentSongIndex];
				setSong(song);
				playSong(song);
			}
		};
		
		/**
		* @function SongPlayer.setCurrentTime
		* @desc Set current time (in seconds) of currently playing song
		* @param {Number} time
		*/
		SongPlayer.setCurrentTime = function(time) {
			if (currentBuzzObject) {
				currentBuzzObject.setTime(time);
			}
		};
		
		/**
		* @function SongPlayer.setVolume
		* @desc Set volume level of currently playing song
		* @param {Number} volume
		*/
		SongPlayer.setVolume = function(volume) {
			if (currentBuzzObject) {
				currentBuzzObject.setVolume(volume);
			}
		};
        
        /**
        * @function SongPlayer.mute
        * @desc mutes currently playing song
        * @param {Object} song
        */
        SongPlayer.mute = function(song) {
            song = song || SongPlayer.currentSong
            currentBuzzObject.mute();
            song.isMuted = true;
        }
        
        /**
        * @function SongPlayer.unmute
        * @desc unmutes currently playing song
        * @param {Object} song
        */
        SongPlayer.unmute = function(song) {
            song = song || SongPlayer.currentSong
            currentBuzzObject.unmute();
            song.isMuted = false;
        }
		
        return SongPlayer;
    }
    
    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
