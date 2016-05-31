import time

from core import core


start_time = time.time()
output_path = core.process_file(False, "resources/input.wav", "mp3")
end_time = time.time()
elapsed = end_time - start_time
print("file generated in {:4.3f}s, path: {}".format(elapsed, output_path))
