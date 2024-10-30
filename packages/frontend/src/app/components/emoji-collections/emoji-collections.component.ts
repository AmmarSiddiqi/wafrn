import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { Emoji } from '../../interfaces/emoji';
import { EmojiCollection } from '../../interfaces/emoji-collection';
//import { emojis } from '../../lists/emoji-compact';
import { EnvironmentService } from '../../services/environment.service';
import { PostsService } from '../../services/posts.service';


@Component({
  selector: 'app-emoji-collections',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    FontAwesomeModule,
    FormsModule,
    MatInputModule,
    MatTooltipModule,
    MatExpansionModule,
  ],
  templateUrl: './emoji-collections.component.html',
  styleUrl: './emoji-collections.component.scss',
})
export class EmojiCollectionsComponent implements OnDestroy {
  copyIcon = faCopy;
  filterText = '';
  emojiCollections: EmojiCollection[] = [];
  subscription: Subscription;
  @Output() emoji: EventEmitter<Emoji> = new EventEmitter<Emoji>();

  baseMediaUrl = EnvironmentService.environment.baseMediaUrl;

  constructor(private postService: PostsService) {
    this.subscription = this.postService.updateFollowers.subscribe(() => {
      this.emojiCollections = this.postService.emojiCollections;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  click(emoji: Emoji) {
    this.emoji.emit({
      id: emoji.id,
      name: emoji.url ? emoji.name : emoji.id,
      url: emoji.url,
      external: false
    });
  }

  showCollection(collection: EmojiCollection): boolean {
    return collection.emojis.map(elem => elem.name).some(elem => elem.includes(this.filterText))
  }

  getEmojiCollectionFiltered(collection: EmojiCollection, query: string): Emoji[] {
    return collection.emojis.filter(elem => elem.name.toLowerCase().includes(query.toLowerCase())).slice(0, 50)

  }
}
