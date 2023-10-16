with open('CVImage.jpg', 'rb') as f:
    imagen_binaria = f.read()

print(imagen_binaria)

f = open("img.txt", "wb")
f.write(imagen_binaria)
f.close()