class Node:
    def __init__(self,data=None,next=None):
        self.data=data
        self.next=next
class linkedlist:
    def __init__(self):
        self.head=None
        
    def traversal(self):
        temp=self.head
        while temp!=None:
            print(temp.data,end="->")
            temp=temp.next
    def insertbegin(self,data):
        n1=Node(data)
        if self.head==None:
            self.head=n1
        else:
            n1.next=self.head
            self.head=n1
ll=linkedlist()
ll.insertbegin(9)
ll.insertbegin(7)
ll.insertbegin(46)
ll.traversal                


 # linked list prblms       
class Solution:
    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:
       c=0
       temp=head
       while temp!=None:
        c+=1
        temp=temp.next
       temp=head
       for i in range(0,(c//2)):
        temp=temp.next
       return temp   


# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution(object):
    def middleNode(self, head):
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        return slow
        #t(n)=o(n/2)
        #s(n)=O(1)