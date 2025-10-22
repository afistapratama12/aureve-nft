'use client';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NFTCardProps {
  id: string | number;
  title: string;
  description?: string;
  price: string;
  image: string;
  creator?: string;
  editions?: number;
  onPurchase?: () => void;
  onFavorite?: () => void;
  className?: string;
}

export function NFTCard({
  title,
  description,
  price,
  image,
  creator,
  editions,
  onPurchase,
  onFavorite,
  className,
}: NFTCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    onFavorite?.();
  };

  return (
    <motion.div
      className={cn('w-full max-w-sm mx-auto', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className='bg-card dark:bg-zinc-900 rounded-xl border border-border overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300'>
        {/* Image Section */}
        <div className='relative w-full aspect-square overflow-hidden bg-muted'>
          <motion.img
            src={image}
            alt={title}
            className='w-full h-full object-cover'
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Favorite Button */}
          <motion.button
            className='absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border'
            onClick={handleFavorite}
            whileTap={{ scale: 0.9 }}
            animate={{ scale: isFavorite ? 1.1 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Heart
              className={cn(
                'w-5 h-5 transition-colors',
                isFavorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-foreground'
              )}
            />
          </motion.button>

          {/* Editions Badge */}
          {editions !== undefined && (
            <div className='absolute top-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border'>
              <span className='text-xs font-medium'>
                {editions} {editions === 1 ? 'Edition' : 'Editions'}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className='p-4 space-y-3'>
          {/* Title & Creator */}
          <div>
            <h3 className='font-semibold text-lg line-clamp-1'>{title}</h3>
            {creator && (
              <p className='text-sm text-muted-foreground mt-1'>
                by {creator}
              </p>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className='text-sm text-muted-foreground line-clamp-2'>
              {description}
            </p>
          )}

          {/* Price & Action */}
          <div className='flex items-center justify-between pt-2'>
            <div>
              <p className='text-xs text-muted-foreground'>Price</p>
              <p className='text-xl font-bold'>{price}</p>
            </div>

            <motion.button
              className='flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors'
              onClick={onPurchase}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingCart className='w-4 h-4' />
              <span>Buy</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
