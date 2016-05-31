# Comment tester ?

```
cd tests

# Lancement du core et des workers
./test.sh start

# Lancement de la conversion d'une vidéo
python ./test-video.py

# Lancement de la conversion d'un fichier audio
python ./test-audio.py
```

La vidéo `tests/resources/input.avi` sera convertie, le résultat sera disponible dans le dossier `tests/.tmp`.
Le fichier audio `tests/resources/input.wav` sera converti, le résultat sera disponible dans le dossier `tests/.tmp`.
