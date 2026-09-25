import React, { useState } from 'react';
import { FriendOrbit } from '../types';

const DOTS = 7;

interface FriendsListProps {
  friends: FriendOrbit[];
}

export const FriendsList: React.FC<FriendsListProps> = ({ friends }) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? friends : friends.slice(0, 3);

  return (
    <section aria-label="Your Friends">
      <div className="flex items-end justify-between">
        <h2 className="font-header text-[26px] leading-none text-ink">Your Friends</h2>
        {friends.length > 3 && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-sm text-ink underline underline-offset-4 decoration-ink/60"
          >
            {showAll ? 'See less' : 'See more'}
          </button>
        )}
      </div>

      <ul className="mt-4 flex flex-col gap-5">
        {visible.map((friend) => {
          // Pink dots = progress toward the next hang-out milestone, lime = still to go
          const filled = Math.min(
            DOTS,
            Math.round((friend.hoursTogether / friend.nextMilestoneHours) * DOTS)
          );
          return (
            <li key={friend.id} className="flex items-center gap-3.5">
              <img
                src={friend.avatar}
                alt={friend.name}
                className="h-[88px] w-[88px] shrink-0 rounded-2xl object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-xl leading-tight text-ink">{friend.name}</p>
                <p className="text-sm text-ink/80">
                  {friend.lastSeenDaysAgo} {friend.lastSeenDaysAgo === 1 ? 'day' : 'days'} since your last hang
                </p>
                <div
                  className="mt-2.5 flex gap-1.5"
                  role="img"
                  aria-label={`${friend.hoursTogether} of ${friend.nextMilestoneHours} hours together`}
                >
                  {Array.from({ length: DOTS }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-5 w-5 rounded-full border border-ink/70 ${i < filled ? 'bg-pink' : 'bg-lime'}`}
                    />
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
