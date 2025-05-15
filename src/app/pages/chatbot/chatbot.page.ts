import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CommonConstants } from '../../shared/classes/common-constants';
import { TranslateKeys } from '../../shared/enums/translate-keys';
import { IHeaderAnimeImage, IHeaderSearchbar, IHeaderSegment } from '../../shared/interfaces/header/header';
import { InputTypes } from '../../shared/enums/input-types';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.page.html',
  styleUrls: ['./chatbot.page.scss'],
  standalone: false
})
export class ChatbotPage implements OnInit {

  animeImage!: IHeaderAnimeImage;
  segment!: IHeaderSegment;
  searchbar!: IHeaderSearchbar;
  inputText: string = '';
  messages: { sender: 'me' | 'bot', text: string, time: string }[] = [];
  userAvatarImg!: string;
  botAvatarImg!: string;

  constructor(
    private authService: AuthService,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.authService.getAuthData().then((authData) => {
      this.userAvatarImg = authData?.avatar_128 && CommonConstants.detectMimeType(authData.avatar_128) ?
        `${CommonConstants.detectMimeType(authData.avatar_128)}${authData?.avatar_128}`
        : '/assets/icons/svg/avatar.svg'
    });
    this.botAvatarImg = '/assets/images/chatbot/chatbot-avatar.png';

    this.animeImage = {
      name: 'Chatbot',
      imageUrl: '/assets/images/chatbot/chat-bot-icon.png',
      width: '150px',
      height: 'auto'
    };

    this.segment = {
      value: 'rank',
      buttons: [
        {value: 'rank', label: TranslateKeys.TITLE_RANK},
        {value: 'achievements', label: TranslateKeys.TITLE_ACHIEVEMENTS}
      ]
    };

    this.searchbar = {
      type: InputTypes.SEARCH,
      inputmode: InputTypes.TEXT,
      placeholder: this.translate.instant(TranslateKeys.TITLE_SEARCH_FRIENDS),
      animated: true,
      showClearButton: true,
    };

    this.messages = [
      {
        sender: 'bot',
        text: 'Rapidly build stunning Web Apps with Frest 🚀\nDeveloper friendly, Highly customizable & Carefully crafted HTML Admin Dashboard Template.',
        time: '7:20',
      },
      {
        sender: 'me',
        text: 'Minimum text check, Hide check icon',
        time: '7:20',
      },
      {
        sender: 'bot',
        text: 'Rapidly build stunning Web Apps with Frest 🚀\nDeveloper friendly, Highly customizable & Carefully crafted HTML Admin Dashboard Template.',
        time: '7:20',
      },
      {
        sender: 'me',
        text: 'More no. of lines text and showing complete list of features like time stamp + check icon READ',
        time: '7:20',
      }
    ];
  }

  onInputChange() {
  }

  onActionButtonClick() {
    if (this.inputText.trim().length > 0) {
      this.sendMessage();
    } else {
      this.startVoiceRecognition();
    }
  }

  sendMessage() {
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    this.messages.push({
      sender: 'me',
      text: this.inputText,
      time,
    });
    this.inputText = '';

    // Trigger Angular to animate element
    setTimeout(() => this.scrollToBottom(), 100);
  }

  startVoiceRecognition() {
  }

  scrollToBottom() {
    const content = document.querySelector('ion-content');
    content?.scrollToBottom(300);
  }

  protected readonly TranslateKeys = TranslateKeys;
}
