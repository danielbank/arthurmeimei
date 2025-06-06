void loop() {
  long total = 0;
  for (int i = 0; i < 5; i++) {
    total += readDistance();
    delay(50);
  }
  
  // Calculate average distance
  int averageDistance = total / 5;
  
  // Validate the distance reading
  if (averageDistance < 2 || averageDistance > 400) {
    averageDistance = 0;
  }
  
  // Display the distance on 7-segment display
  displayNumber(averageDistance);
  
  // Small delay before next reading
  delay(100);
} 