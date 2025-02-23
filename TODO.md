1. The update should be performed after all calculations are completed (current tick, next tick)  
  After the queue of calculations, when they finish, the `DOM` is updated.  
  After the next queue of reactive calculations is executed, the next `tick` of the dom'DOM` update is executed.  
  So every time the reactive states change, there are no changes in the `DOM`, but only at the end of the current queue.  