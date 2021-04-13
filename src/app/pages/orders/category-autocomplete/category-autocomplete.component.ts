import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {AutocompleteOptionGroups} from '../../../core/models/order';
import {FormControl} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-category-autocomplete',
  templateUrl: './category-autocomplete.component.html',
  styleUrls: ['./category-autocomplete.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryAutocompleteComponent implements OnInit {
  @Output() search = new EventEmitter<string>();
  @Output() selected = new EventEmitter<{service: AutocompleteOptionGroups, subservice: AutocompleteOptionGroups}>();
  @Input() placeholder: string;
  @Input() loading: boolean;
  @Input() set searchResult(value: AutocompleteOptionGroups[]) {    
    if (value) {
      this.showSearchResult = value;
    }
  }
  showSearchResult: AutocompleteOptionGroups[];
  searchStreamSubscription = new Subscription();
  constructor() {}

  onChange(value: string): void {
  }

  ngOnInit(): void {
  }

  optionSelected(event, option: AutocompleteOptionGroups, result: AutocompleteOptionGroups): void {
    if (event.isUserInput) {
      this.selected.emit({service: result, subservice: option});
    }
  }

  searchFor(event: InputEvent): void {
    this.search.emit(event.data);
    // if (this.searchStreamSubscription) {
    //   this.searchStreamSubscription.unsubscribe();
    // }
    // const searchStream = new Observable();
    // this.searchStreamSubscription = searchStream.pipe(debounceTime(2000)).subscribe(() => {
    // })
  }
}
