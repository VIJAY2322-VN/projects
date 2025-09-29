n=int(input("enter  the num:"))
v=0
for i in range (2,(n//2)+1):
    if n%i==0:
        v+=1
if v==0:
    print("prime")
else:
    print("composite")       
