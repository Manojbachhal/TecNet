
import React from 'react';

const TradingGuidelines = () => {
  return (
    <div className="mt-8 p-6 bg-card rounded-lg shadow-subtle">
      <h2 className="text-xl font-bold mb-4">Trading Platform Guidelines</h2>
      <div className="text-sm space-y-2">
        <p className="text-muted-foreground">
          <strong>Safety First:</strong> Always meet in public places for local transactions. Police station parking lots are recommended.
        </p>
        <p className="text-muted-foreground">
          <strong>Legal Compliance:</strong> All transactions must comply with federal, state, and local laws. Many transfers require an FFL.
        </p>
        <p className="text-muted-foreground">
          <strong>Verify Identity:</strong> Always verify the identity of the person you're dealing with before completing a transaction.
        </p>
        <p className="text-muted-foreground">
          <strong>Inspection:</strong> Thoroughly inspect any firearm before purchase. Check for function, safety, and proper serialization.
        </p>
      </div>
    </div>
  );
};

export default TradingGuidelines;
